//cooldown/check-cooldown-sql/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get("clerkUserId");
    const questionId = searchParams.get("questionId");

    if (!clerkUserId || !questionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ cooldownUntil: null });
    }

    const dbQuestionId = `sql-${questionId}`;
    const attempt = await prisma.userQuestionAttempt.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: dbQuestionId,
        },
      },
    });

    // Return cooldown info if exists and is still active
    if (attempt && attempt.cooldownUntil && new Date() < attempt.cooldownUntil) {
      return NextResponse.json({
        cooldownUntil: attempt.cooldownUntil.toISOString(),
        failureCount: attempt.failureCount,
      });
    }

    return NextResponse.json({ cooldownUntil: null });
  } catch (error) {
    console.error("Error checking cooldown:", error);
    return NextResponse.json(
      { error: "Failed to check cooldown" },
      { status: 500 }
    );
  }
}