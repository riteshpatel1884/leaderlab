import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Verdict, Difficulty } from "@prisma/client";

// Map difficulty strings to Prisma enum
function mapDifficulty(difficulty: string): Difficulty {
  switch (difficulty.toUpperCase()) {
    case "EASY":
      return Difficulty.EASY;
    case "MEDIUM":
      return Difficulty.MEDIUM;
    case "HARD":
      return Difficulty.HARD;
    default:
      return Difficulty.MEDIUM;
  }
}

// Extract verdict from feedback
function extractVerdict(feedback: string): Verdict {
  const lowerFeedback = feedback.toLowerCase();
  
  // Look for explicit verdict indicators
  if (lowerFeedback.includes("pass") || lowerFeedback.includes("excellent") || 
      lowerFeedback.includes("correct") || lowerFeedback.includes("well done")) {
    return Verdict.PASS;
  }
  
  if (lowerFeedback.includes("weak") || lowerFeedback.includes("needs improvement") ||
      lowerFeedback.includes("could be better") || lowerFeedback.includes("partially correct")) {
    return Verdict.WEAK;
  }
  
  if (lowerFeedback.includes("fail") || lowerFeedback.includes("incorrect") ||
      lowerFeedback.includes("wrong") || lowerFeedback.includes("does not")) {
    return Verdict.FAIL;
  }
  
  // Default to WEAK if unclear
  return Verdict.WEAK;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      question, 
      schema, 
      userQuery, 
      followUp, 
      conversationHistory, 
      userResponse,
      questionId,
      difficulty,
      topic,
      clerkUserId 
    } = await req.json();

    if (!question || !schema || !userQuery) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let prompt;
    
    if (followUp && conversationHistory && userResponse) {
      // Handle follow-up conversation
      const lastMessages = conversationHistory.slice(-4); // Only last 2 exchanges
      const attemptCount = conversationHistory.filter((msg: any) => msg.role === 'user').length;
      
      // After 2 user attempts, offer to show the answer
      const shouldShowAnswer = attemptCount >= 2;
      
      prompt = `SQL Problem: ${question}
User's Query: ${userQuery}

${lastMessages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

${shouldShowAnswer ? `
The user has tried multiple times. If they're still stuck or asking for help:
1. Show the correct SQL query
2. Explain it briefly (2-3 lines max)
3. Point out the key difference from their approach

Keep it short and clear.` : 'Respond briefly and naturally. If they\'re stuck after hints, give one more hint or ask if they want to see the answer.'}`;
    } else {
      // Initial evaluation
      prompt = `Evaluate this SQL query:

Problem: ${question}

Schema:
${schema}

User's Query:
${userQuery}

Rules:
1. Start with: **PASS**, **WEAK**, or **FAIL**
2. Keep response SHORT (max 4-5 lines)

If PASS:
- Say "Correct!" 
- Ask ONE follow-up question (optional)

If WEAK/FAIL:
- Give 1-2 specific hints (don't explain everything)
- Don't give the answer yet - let them try

Be direct and concise like a real interviewer.`;
    }

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // or "mixtral-8x7b-32768" for faster responses
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5, // Lower for more focused responses
        max_tokens: 500, // Reduced from 2000 to keep answers short
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to evaluate query" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const feedback = data.choices[0]?.message?.content || "Unable to generate feedback";

    // Store in database only for initial submissions (not follow-ups) and when user is authenticated
    if (!followUp && clerkUserId && questionId && difficulty && topic) {
      try {
        // Get or create user
        const user = await prisma.user.upsert({
          where: { clerkUserId: clerkUserId },
          update: {},
          create: {
            clerkUserId: clerkUserId,
            name: null, // Can be updated later from Clerk user data
          },
        });

        // Get or create subject (topic)
        const subject = await prisma.subject.upsert({
          where: { slug: topic.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            name: topic,
            slug: topic.toLowerCase().replace(/\s+/g, '-'),
            isActive: true,
          },
        });

        // Get or create question
        const dbQuestion = await prisma.question.upsert({
          where: { id: `sql-${questionId}` },
          update: {},
          create: {
            id: `sql-${questionId}`,
            subjectId: subject.id,
            difficulty: mapDifficulty(difficulty),
            isActive: true,
          },
        });

        // Extract verdict from feedback
        const verdict = extractVerdict(feedback);

        // Create or update user question attempt
        await prisma.userQuestionAttempt.upsert({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: dbQuestion.id,
            },
          },
          update: {
            verdict: verdict,
            attemptedAt: new Date(),
          },
          create: {
            userId: user.id,
            questionId: dbQuestion.id,
            subjectId: subject.id,
            verdict: verdict,
          },
        });

        // Update user subject summary
        const summary = await prisma.userSubjectSummary.findUnique({
          where: {
            userId_subjectId: {
              userId: user.id,
              subjectId: subject.id,
            },
          },
        });

        if (summary) {
          // Calculate new counts based on all attempts for this subject
          const allAttempts = await prisma.userQuestionAttempt.findMany({
            where: {
              userId: user.id,
              subjectId: subject.id,
            },
          });

          const solvedCount = allAttempts.filter(a => a.verdict === Verdict.PASS).length;
          const failedCount = allAttempts.filter(a => a.verdict === Verdict.FAIL).length;

          await prisma.userSubjectSummary.update({
            where: {
              userId_subjectId: {
                userId: user.id,
                subjectId: subject.id,
              },
            },
            data: {
              solvedCount,
              failedCount,
              lastActivity: new Date(),
            },
          });
        } else {
          // Create new summary
          const solvedCount = verdict === Verdict.PASS ? 1 : 0;
          const failedCount = verdict === Verdict.FAIL ? 1 : 0;

          await prisma.userSubjectSummary.create({
            data: {
              userId: user.id,
              subjectId: subject.id,
              solvedCount,
              failedCount,
              lastActivity: new Date(),
            },
          });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue even if database operation fails - don't block the user
      }
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error evaluating SQL:", error);
    return NextResponse.json(
      { error: "Failed to evaluate query" },
      { status: 500 }
    );
  }
}