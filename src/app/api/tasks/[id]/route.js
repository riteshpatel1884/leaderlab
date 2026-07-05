import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/tasks/[id] — update a task, e.g. { done: true }
export async function PATCH(request, { params }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  // Only allow updating fields we expect; ignore anything else in the body.
  const data = {};
  if (typeof body.done === "boolean") data.done = body.done;
  if (typeof body.text === "string" && body.text.trim()) data.text = body.text.trim();

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // updateMany enforces ownership: only updates if clerkUserId matches too,
  // so a user can never touch another user's task by guessing an id.
  const result = await prisma.task.updateMany({
    where: { id, clerkUserId: userId },
    data,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const task = await prisma.task.findUnique({ where: { id } });
  return NextResponse.json(task);
}

// DELETE /api/tasks/[id] — remove a task
export async function DELETE(_request, { params }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  const result = await prisma.task.deleteMany({
    where: { id, clerkUserId: userId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}