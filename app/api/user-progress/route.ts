// app/api/user-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Verdict } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get("clerkUserId");

  if (!clerkUserId) return NextResponse.json({ solvedIds: [] });

  try {
    const attempts = await prisma.userQuestionAttempt.findMany({
      where: {
        user: { clerkUserId },
        verdict: Verdict.PASS,
      },
      select: { questionId: true },
    });

    // Extract the numeric ID from "sql-1" format
    const solvedIds = attempts.map((a) => 
      parseInt(a.questionId.replace("sql-", ""))
    );

    return NextResponse.json({ solvedIds });
  } catch (error) {
    return NextResponse.json({ solvedIds: [] }, { status: 500 });
  }
}