// user-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Verdict } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get("clerkUserId");

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Missing clerkUserId parameter" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
      include: {
        attempts: {
          where: {
            questionId: {
              startsWith: "sql-",
            },
          },
          select: {
            questionId: true,
            verdict: true,
            cooldownUntil: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ solvedIds: [], failedIds: [] });
    }

    // Extract solved question IDs (PASS verdict)
    const solvedIds = user.attempts
      .filter((attempt) => attempt.verdict === Verdict.PASS)
      .map((attempt) => parseInt(attempt.questionId.replace("sql-", "")));

    // Extract failed/locked question IDs (FAIL verdict with active or past cooldown)
    const failedIds = user.attempts
      .filter((attempt) => 
        attempt.verdict === Verdict.FAIL && 
        attempt.cooldownUntil !== null
      )
      .map((attempt) => parseInt(attempt.questionId.replace("sql-", "")));

    return NextResponse.json({ 
      solvedIds,
      failedIds
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}