// app/api/application/trackKJob/notifications/route.js
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getNotifications, markAllRead } from "../../../../../lib/TrackJob/notifications";

// GET /api/notifications — fetch user's notifications
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await getNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH /api/notifications — mark all as read
export async function PATCH() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await markAllRead(userId);
  return NextResponse.json({ success: true });
}