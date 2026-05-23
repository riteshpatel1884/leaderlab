// app/api/admin/send-email/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { sendAdminCustomEmail } from "../../../../lib/TrackJob/email";
import { createNotification } from "../../../../lib/TrackJob/notifications";

function isAdmin(request) {
  const secret = request.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

// GET /api/admin/send-email
export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use findMany with distinct to get one row per user, with their latest email
  const rows = await prisma.application.findMany({
    select: {
      clerkUserId: true,
      notifyEmail: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Deduplicate by clerkUserId — keep first occurrence (most recent due to orderBy)
  const seen = new Map();
  for (const row of rows) {
    if (!seen.has(row.clerkUserId)) {
      seen.set(row.clerkUserId, { notifyEmail: row.notifyEmail, lastActive: row.createdAt });
    } else if (row.notifyEmail && !seen.get(row.clerkUserId).notifyEmail) {
      // If earlier entry had no email but this one does, use it
      seen.get(row.clerkUserId).notifyEmail = row.notifyEmail;
    }
  }

  // Get application counts per user
  const counts = await prisma.application.groupBy({
    by: ["clerkUserId"],
    _count: { id: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.clerkUserId, c._count.id]));

  const formatted = Array.from(seen.entries()).map(([clerkUserId, data]) => ({
    clerkUserId,
    notifyEmail: data.notifyEmail || null,
    applicationCount: countMap[clerkUserId] || 0,
    lastActive: data.lastActive,
  }));

  return NextResponse.json({ users: formatted, total: formatted.length });
}

// POST /api/admin/send-email
export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { subject, message, recipients = "all", customEmails = [] } = body;

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  // ── Build target user list with reliable email lookup ──────────────────────
  let targetUsers = [];

  if (recipients === "all" || recipients === "with_email") {
    // Fetch all rows, then deduplicate per user keeping their email
    const rows = await prisma.application.findMany({
      select: { clerkUserId: true, notifyEmail: true },
      // For "with_email", only fetch rows that actually have an email
      where: recipients === "with_email" ? { notifyEmail: { not: null } } : {},
    });

    // Deduplicate: one entry per clerkUserId, prefer rows with a notifyEmail
    const userMap = new Map();
    for (const row of rows) {
      if (!userMap.has(row.clerkUserId)) {
        userMap.set(row.clerkUserId, row.notifyEmail || null);
      } else if (row.notifyEmail && !userMap.get(row.clerkUserId)) {
        userMap.set(row.clerkUserId, row.notifyEmail);
      }
    }

    targetUsers = Array.from(userMap.entries()).map(([clerkUserId, email]) => ({
      clerkUserId,
      email,
    }));
  } else if (Array.isArray(recipients)) {
    const rows = await prisma.application.findMany({
      select: { clerkUserId: true, notifyEmail: true },
      where: { clerkUserId: { in: recipients } },
    });

    const userMap = new Map();
    for (const row of rows) {
      if (!userMap.has(row.clerkUserId)) {
        userMap.set(row.clerkUserId, row.notifyEmail || null);
      } else if (row.notifyEmail && !userMap.get(row.clerkUserId)) {
        userMap.set(row.clerkUserId, row.notifyEmail);
      }
    }

    targetUsers = Array.from(userMap.entries()).map(([clerkUserId, email]) => ({
      clerkUserId,
      email,
    }));
  }

  const results = { total: 0, emailed: 0, notified: 0, skipped: 0, errors: [] };

  // ── Send to registered users ───────────────────────────────────────────────
  for (const user of targetUsers) {
    results.total++;
    try {
      // Always create in-app notification
      await createNotification({
        clerkUserId: user.clerkUserId,
        type: "admin_message",
        title: subject.trim(),
        body: message.trim(),
        applicationId: null,
      });
      results.notified++;

      if (user.email) {
        await sendAdminCustomEmail({
          to: user.email,
          subject: subject.trim(),
          message: message.trim(),
        });
        results.emailed++;
      } else {
        results.skipped++;
      }
    } catch (err) {
      results.errors.push({ clerkUserId: user.clerkUserId, error: err.message });
    }
  }

  // ── Send to custom emails (email only, no in-app notif) ───────────────────
  for (const email of customEmails) {
    if (!email?.trim()) continue;
    results.total++;
    try {
      await sendAdminCustomEmail({
        to: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      results.emailed++;
    } catch (err) {
      results.errors.push({ email, error: err.message });
    }
  }

  return NextResponse.json(results);
}