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
  
  if (lowerFeedback.includes("correct") || 
      lowerFeedback.includes("excellent") || 
      lowerFeedback.includes("great explanation") ||
      lowerFeedback.includes("well done") ||
      lowerFeedback.includes("✓")) {
    return Verdict.PASS;
  }
  
  if (lowerFeedback.includes("incorrect") || 
      lowerFeedback.includes("wrong") ||
      lowerFeedback.includes("poor explanation") ||
      lowerFeedback.includes("major issues") ||
      lowerFeedback.includes("✗")) {
    return Verdict.FAIL;
  }
  
  return Verdict.WEAK;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      question,
      userAnswer,
      codeSubmission, // Optional: for code-based questions
      followUp,
      conversationHistory,
      userResponse,
      questionId,
      difficulty,
      topic,
      clerkUserId,
      attemptNumber,
      isCorrect,
      hasAskedFollowUp,
      language // Programming language context
    } = await req.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check cooldown status if this is first submission (not follow-up)
    if (!followUp && clerkUserId && questionId) {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkUserId: clerkUserId },
        });

        if (user) {
          const dbQuestionId = `oop-${questionId}`;
          const attempt = await prisma.userQuestionAttempt.findUnique({
            where: {
              userId_questionId: {
                userId: user.id,
                questionId: dbQuestionId,
              },
            },
          });

          // Check if user is in cooldown period
          if (attempt && attempt.cooldownUntil && new Date() < attempt.cooldownUntil) {
            const hoursLeft = Math.ceil((attempt.cooldownUntil.getTime() - Date.now()) / (1000 * 60 * 60));
            return NextResponse.json({
              feedback: `⏳ **COOLDOWN ACTIVE**\n\nYou failed this OOP question previously. You can retry after **${hoursLeft} hours**.\n\nUse this time to:\n- Review OOP concepts and principles\n- Study design patterns\n- Practice explaining concepts clearly\n- Read the topic documentation\n\nCome back stronger! 💪`,
              cooldown: true,
              cooldownUntil: attempt.cooldownUntil.toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Cooldown check error:", err);
      }
    }

    let prompt;
    let shouldLockQuestion = false;
    let cooldownUntil = null;
    let shouldAskFollowUp = false;
    
    if (followUp && conversationHistory && userResponse) {
      // This is a follow-up conversation
      if (isCorrect) {
        // User already passed - just answer their question
        prompt = `OOP Interview Question: ${question}

User's CORRECT Answer:
${userAnswer}

${codeSubmission ? `User's Code:\n\`\`\`\n${codeSubmission}\n\`\`\`` : ''}

The user's explanation and understanding were CORRECT. They are now asking a follow-up question about the OOP concept.

Previous conversation:
${conversationHistory.slice(-4).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

INTERVIEWER ROLE:
You are an experienced OOP interviewer. The candidate passed this question.

RESPONSE RULES:
1. Answer their question briefly and clearly (2-4 sentences)
2. Be helpful and educational
3. Provide examples if relevant
4. DO NOT ask any more questions - just answer
5. Keep it conversational and encouraging`;
      } else if (hasAskedFollowUp) {
        // AI already asked a follow-up, this is the user's response to it
        prompt = `OOP Interview Context: ${question}

Previous conversation:
${conversationHistory.slice(-4).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User's Response: ${userResponse}

INTERVIEWER ROLE:
You asked a follow-up question. Now evaluate their response.

RESPONSE RULES:
1. Evaluate their answer briefly (2-3 sentences)
2. If correct/satisfactory, acknowledge it: "Good understanding!" or "That's correct!"
3. If incorrect, provide a brief correction with explanation
4. DO NOT ask another follow-up question
5. Keep it professional yet friendly`;
      } else {
        // User is asking for help/clarification
        prompt = `OOP Interview Question: ${question}

User's Current Answer:
${userAnswer}

${codeSubmission ? `User's Code:\n\`\`\`\n${codeSubmission}\n\`\`\`` : ''}

Previous feedback:
${conversationHistory.slice(-2).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User's Question: ${userResponse}

INTERVIEWER ROLE:
You are an experienced OOP interviewer helping a candidate.

RESPONSE RULES:
1. Look at their current answer and the feedback given
2. Give ONE specific, actionable hint (2-4 sentences)
3. Don't reveal the complete answer
4. Guide them toward the correct understanding
5. Focus on the OOP concept they're struggling with
6. Be encouraging and supportive`;
      }
    } else {
      // Initial submission or retry attempt
      const currentAttempt = attemptNumber || 1;
      
      if (currentAttempt === 3) {
        // Third attempt - give comprehensive answer and lock
        prompt = `OOP Interview Question (FINAL ATTEMPT 3/3): ${question}

${language ? `Programming Language Context: ${language}` : ''}

User's Answer:
${userAnswer}

${codeSubmission ? `User's Code:\n\`\`\`${language || ''}\n${codeSubmission}\n\`\`\`` : ''}

INTERVIEWER ROLE:
You are an experienced OOP interviewer. This is the candidate's FINAL attempt.

EVALUATION RULES FOR FINAL ATTEMPT:
1. Start with "**PASS**" if their understanding is solid, or "**FAIL**" if not

2. If FAIL:
   - Provide a COMPREHENSIVE explanation of the correct answer
   - Include a complete code example if applicable (well-commented)
   - Explain the key OOP concepts involved
   - Mention common mistakes to avoid
   - End with: "This question is now locked for 24 hours. Review this material and try again."

3. If PASS:
   - Acknowledge their correct understanding
   - Provide a brief enhancement or optimization suggestion
   - Ask ONE conceptual follow-up question ONLY if the topic is advanced (like design patterns, SOLID principles)
   - For basic concepts (encapsulation, inheritance), just congratulate them

RESPONSE FORMAT:
- Be thorough but structured
- Use bullet points for clarity
- Include code examples with syntax highlighting
- Keep it professional yet encouraging`;
      } else {
        // First or second attempt
        const remainingAttempts = 3 - currentAttempt;
        prompt = `OOP Interview Question (Attempt ${currentAttempt}/3): ${question}

${language ? `Programming Language Context: ${language}` : ''}

User's Answer:
${userAnswer}

${codeSubmission ? `User's Code:\n\`\`\`${language || ''}\n${codeSubmission}\n\`\`\`` : ''}

INTERVIEWER ROLE:
You are an experienced OOP interviewer conducting a technical interview.

EVALUATION RULES:

1. Start with "**PASS**" or "**FAIL**"

2. If PASS:
   - Acknowledge what they got right (2-3 sentences)
   - If it's a complex topic (design patterns, SOLID, polymorphism), ask ONE conceptual follow-up
   - For simple topics (basic encapsulation, simple inheritance), just congratulate
   - Example follow-up: "Can you explain when you'd use composition over inheritance?"

3. If FAIL:
   - Identify the main gap in their understanding
   - Give ONE specific hint or guiding question
   - Don't reveal the complete answer yet
   - Say: "You have ${remainingAttempts} attempt(s) remaining. Think about [specific concept] and try again."

RESPONSE STYLE:
- Be professional but friendly
- Focus on understanding, not just memorization
- Give constructive feedback
- Keep response under 6-7 sentences unless asking follow-up`;
      }
    }

    // Call Groq API (or your preferred LLM API)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert OOP interviewer with deep knowledge of object-oriented programming concepts, design patterns, and SOLID principles. You evaluate candidates' understanding through clear, constructive feedback. You focus on conceptual understanding rather than just syntax."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to evaluate answer" },
        { status: 500 }
      );
    }

    const data = await response.json();
    let feedback = data.choices[0]?.message?.content || "Unable to generate feedback";
    const verdict = extractVerdict(feedback);

    let finalVerdict = verdict;
    let failureCount = 0;
    const currentAttempt = attemptNumber || 1;

    // Check if AI asked a follow-up question (only for complex topics)
    const aiAskedFollowUp = feedback.includes('?') && 
                           verdict === Verdict.PASS && 
                           !followUp &&
                           (topic.includes("Design Patterns") || 
                            topic.includes("SOLID") || 
                            topic.includes("Polymorphism") ||
                            topic.includes("Multiple Concepts"));

    // Store in database
    if (clerkUserId && questionId && difficulty && topic && !followUp) {
      try {
        const user = await prisma.user.upsert({
          where: { clerkUserId: clerkUserId },
          update: {},
          create: { clerkUserId: clerkUserId, name: null },
        });

        const subject = await prisma.subject.upsert({
          where: { slug: 'oop' },
          update: {},
          create: {
            name: 'Object-Oriented Programming',
            slug: 'oop',
            isActive: true,
          },
        });

        const dbQuestion = await prisma.question.upsert({
          where: { id: `oop-${questionId}` },
          update: {},
          create: {
            id: `oop-${questionId}`,
            subjectId: subject.id,
            difficulty: mapDifficulty(difficulty),
            isActive: true,
          },
        });

        // Get existing attempt
        const existingAttempt = await prisma.userQuestionAttempt.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: dbQuestion.id,
            },
          },
        });

        failureCount = existingAttempt?.failureCount || 0;

        // Determine final verdict and locking
        if (verdict === Verdict.PASS) {
          // User passed
          finalVerdict = Verdict.PASS;
          cooldownUntil = null;
          failureCount = 0;
        } else if (currentAttempt >= 3) {
          // Failed on third attempt - lock question
          finalVerdict = Verdict.FAIL;
          failureCount = failureCount + 1;
          const cooldownHours = 24;
          cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
          shouldLockQuestion = true;
          
          feedback += `\n\n⏳ **Question Locked for 24 hours**\n\nReview the explanation above carefully. Take time to understand the concept before retrying.`;
        } else {
          // Failed but has more attempts
          finalVerdict = Verdict.WEAK;
        }

        // Update database
        await prisma.userQuestionAttempt.upsert({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: dbQuestion.id,
            },
          },
          update: {
            verdict: finalVerdict,
            attemptedAt: new Date(),
            cooldownUntil: cooldownUntil,
            failureCount: failureCount,
          },
          create: {
            userId: user.id,
            questionId: dbQuestion.id,
            subjectId: subject.id,
            verdict: finalVerdict,
            cooldownUntil: cooldownUntil,
            failureCount: failureCount,
          },
        });

        // Update subject summary
        const allAttempts = await prisma.userQuestionAttempt.findMany({
          where: { userId: user.id, subjectId: subject.id },
        });

        const solvedCount = allAttempts.filter(a => a.verdict === Verdict.PASS).length;
        const failedCount = allAttempts.filter(a => a.verdict === Verdict.FAIL).length;

        await prisma.userSubjectSummary.upsert({
          where: {
            userId_subjectId: {
              userId: user.id,
              subjectId: subject.id,
            },
          },
          update: {
            solvedCount,
            failedCount,
            lastActivity: new Date(),
          },
          create: {
            userId: user.id,
            subjectId: subject.id,
            solvedCount,
            failedCount,
            lastActivity: new Date(),
          },
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    return NextResponse.json({ 
      feedback,
      cooldown: shouldLockQuestion,
      cooldownUntil: cooldownUntil?.toISOString(),
      isCorrect: verdict === Verdict.PASS,
      hasAskedFollowUp: aiAskedFollowUp,
      attemptNumber: followUp ? attemptNumber : currentAttempt
    });
  } catch (error) {
    console.error("Error evaluating OOP answer:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}