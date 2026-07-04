// app/api/cron/trackJob/route.js


import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/db";
import { sendFollowUpReminderEmail } from "../../../../lib/TrackJob/email";
import { createNotification } from "../../../../lib/TrackJob/notifications";

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // "tomorrow" window: 24h from now
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  // Find all applications with followUpDate exactly tomorrow
  // and status is still "Applied" (not yet responded)
  const applications = await prisma.application.findMany({
    where: {
      followUpDate: {
        gte: tomorrow,
        lt: dayAfterTomorrow,
      },
      status: "Applied",
    },
  });

  const results = { total: applications.length, emailed: 0, notified: 0, errors: [] };

  for (const app of applications) {
    try {
      // 1. Always create in-app notification
      await createNotification({
        clerkUserId: app.clerkUserId,
        type: "followup_reminder",
        title: `Follow-up reminder: ${app.company}`,
        body: `Your follow-up for ${app.role} at ${app.company} is due tomorrow.`,
        applicationId: app.id,
      });
      results.notified++;

      // 2. Send email only if notifyEmail is set
      if (app.notifyEmail) {
        await sendFollowUpReminderEmail({
          to: app.notifyEmail,
          application: app,
        });
        results.emailed++;
      }
    } catch (err) {
      results.errors.push({ appId: app.id, error: err.message });
    }
  }

  return NextResponse.json(results);
}