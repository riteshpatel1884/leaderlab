// app/api/applications/trackJob/notifications/[id]/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../../../lib/db";

// PATCH → mark one notification as read
export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.notification.updateMany({
      where: { id, clerkUserId: userId },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH notification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → permanently remove a notification
export async function DELETE(request, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const result = await prisma.notification.deleteMany({
      where: { id, clerkUserId: userId },
    });

    console.log(`Deleted notification ${id} for user ${userId}:`, result);

    if (result.count === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("DELETE notification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}