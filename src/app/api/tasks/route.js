import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard — list today's-plan tasks for the current user
export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks — create a new task { text: string }
export async function POST(request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = (body?.text || "").trim();

  if (!text) {
    return NextResponse.json({ error: "Task text is required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      clerkUserId: userId,
      text,
      done: false,
    },
  });

  return NextResponse.json(task, { status: 201 });
}