

// app/api/applications/route.js
// Full route — GET all applications + POST new application with email/notification trigger

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma }  from "../../../lib/db";
import { sendApplicationAddedEmail } from "../../../lib/TrackJob/email";
import { createNotification } from "../../../lib/TrackJob/notifications";

// GET /api/applications
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await prisma.application.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates to ISO strings for the client
  const serialized = applications.map(serializeApp);
  return NextResponse.json(serialized);
}

// POST /api/applications
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    company, role, jobType, applyType, platform, jobLink,
    dateApplied, status, workType, followUpDate, salary,
    resumeVersion, notes, rejectionReason, notifyEmail,
  } = body;

  if (!company?.trim() || !role?.trim()) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
  }

  const application = await prisma.application.create({
    data: {
      clerkUserId: userId,
      company: company.trim(),
      role: role.trim(),
      jobType: jobType || "Job",
      applyType: applyType || "Direct Apply",
      platform: platform || null,
      jobLink: jobLink || null,
      dateApplied: dateApplied ? new Date(dateApplied) : null,
      status: status || "Applied",
      workType: workType || "Onsite",
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      salary: salary || null,
      resumeVersion: resumeVersion || null,
      notes: notes || null,
      rejectionReason: rejectionReason || null,
      notifyEmail: notifyEmail?.trim() || null,
      statusHistory: [{ status: status || "Applied", date: new Date().toISOString() }],
    },
  });

  // ── Fire notifications (non-blocking) ──────────────────────────────────────
  const notifAndEmail = async () => {
    try {
      // 1. Always create in-app notification
      await createNotification({
        clerkUserId: userId,
        type: "application_added",
        title: `Application added: ${company}`,
        body: `You applied for ${role} at ${company}${platform ? ` via ${platform}` : ""}.`,
        applicationId: application.id,
      });

      // 2. Send email only if notifyEmail is provided
      if (notifyEmail?.trim()) {
        await sendApplicationAddedEmail({
          to: notifyEmail.trim(),
          application,
        });
      }
    } catch (err) {
      // Log but don't fail the request
      console.error("[notifications] Error sending notification/email:", err);
    }
  };

  // Don't await — fire and forget so the POST returns fast
  notifAndEmail();

  return NextResponse.json(serializeApp(application), { status: 201 });
}

// ── Helper ────────────────────────────────────────────────────────────────────
function serializeApp(app) {
  return {
    ...app,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    followUpDate: app.followUpDate?.toISOString().split("T")[0] ?? null,
    createdAt: app.createdAt?.toISOString() ?? null,
    updatedAt: app.updatedAt?.toISOString() ?? null,
  };
}