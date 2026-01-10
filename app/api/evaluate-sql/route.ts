// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { Verdict, Difficulty } from "@prisma/client";

// // Map difficulty strings to Prisma enum
// function mapDifficulty(difficulty: string): Difficulty {
//   switch (difficulty.toUpperCase()) {
//     case "EASY":
//       return Difficulty.EASY;
//     case "MEDIUM":
//       return Difficulty.MEDIUM;
//     case "HARD":
//       return Difficulty.HARD;
//     default:
//       return Difficulty.MEDIUM;
//   }
// }

// // Extract verdict from feedback
// function extractVerdict(feedback: string): Verdict {
//   const lowerFeedback = feedback.toLowerCase();
  
//   if (lowerFeedback.includes("pass") || lowerFeedback.includes("excellent") || 
//       lowerFeedback.includes("correct") || lowerFeedback.includes("well done")) {
//     return Verdict.PASS;
//   }
  
//   if (lowerFeedback.includes("weak") || lowerFeedback.includes("needs improvement") ||
//       lowerFeedback.includes("could be better") || lowerFeedback.includes("partially correct")) {
//     return Verdict.WEAK;
//   }
  
//   if (lowerFeedback.includes("fail") || lowerFeedback.includes("incorrect") ||
//       lowerFeedback.includes("wrong") || lowerFeedback.includes("does not")) {
//     return Verdict.FAIL;
//   }
  
//   return Verdict.WEAK;
// }

// // Calculate cooldown period based on failure count
// function getCooldownHours(failureCount: number): number {
//   if (failureCount === 1) return 24; // 1 day
//   if (failureCount === 2) return 72; // 3 days
//   return 168; // 7 days for 3+ failures
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { 
//       question, 
//       schema, 
//       userQuery, 
//       followUp, 
//       conversationHistory, 
//       userResponse,
//       questionId,
//       difficulty,
//       topic,
//       clerkUserId 
//     } = await req.json();

//     if (!question || !schema || !userQuery) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check cooldown status if this is first submission (not follow-up)
//     if (!followUp && clerkUserId && questionId) {
//       try {
//         const user = await prisma.user.findUnique({
//           where: { clerkUserId: clerkUserId },
//         });

//         if (user) {
//           const dbQuestionId = `sql-${questionId}`;
//           const attempt = await prisma.userQuestionAttempt.findUnique({
//             where: {
//               userId_questionId: {
//                 userId: user.id,
//                 questionId: dbQuestionId,
//               },
//             },
//           });

//           // Check if user is in cooldown period
//           if (attempt && attempt.cooldownUntil && new Date() < attempt.cooldownUntil) {
//             const hoursLeft = Math.ceil((attempt.cooldownUntil.getTime() - Date.now()) / (1000 * 60 * 60));
//             return NextResponse.json({
//               feedback: `⏳ **COOLDOWN ACTIVE**\n\nYou failed this question previously. You can retry after **${hoursLeft} hours**.\n\nUse this time to:\n- Review SQL concepts\n- Practice similar problems\n- Study the schema carefully\n\nCome back stronger! 💪`,
//               cooldown: true,
//               cooldownHours: hoursLeft,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("Cooldown check error:", err);
//       }
//     }

//     let prompt;
//     let isRetryAfterCooldown = false;
    
//     if (followUp && conversationHistory && userResponse) {
//       const attemptCount = conversationHistory.filter((msg: any) => msg.role === 'user').length;
//       const shouldShowAnswer = attemptCount >= 2;
      
//       prompt = `SQL Problem: ${question}
// User's Query: ${userQuery}

// ${conversationHistory.slice(-4).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

// User: ${userResponse}

// ${shouldShowAnswer ? `
// The user has tried multiple times and is still stuck.
// 1. Start with "**FAIL**" (user will be marked as failed)
// 2. Show the correct SQL query
// 3. Explain it briefly (2-3 lines max)
// 4. Tell them they can retry after cooldown period

// Keep it short and clear.` : 'Respond briefly. If they\'re stuck after hints, give one more hint or ask if they want to see the answer.'}`;
//     } else {
//       // Check if this is a retry after cooldown
//       if (clerkUserId && questionId) {
//         try {
//           const user = await prisma.user.findUnique({
//             where: { clerkUserId: clerkUserId },
//           });
          
//           if (user) {
//             const attempt = await prisma.userQuestionAttempt.findUnique({
//               where: {
//                 userId_questionId: {
//                   userId: user.id,
//                   questionId: `sql-${questionId}`,
//                 },
//               },
//             });
            
//             if (attempt && attempt.verdict === Verdict.FAIL && 
//                 (!attempt.cooldownUntil || new Date() >= attempt.cooldownUntil)) {
//               isRetryAfterCooldown = true;
//             }
//           }
//         } catch (err) {
//           console.error("Retry check error:", err);
//         }
//       }

//       prompt = `Evaluate this SQL query:

// Problem: ${question}

// Schema:
// ${schema}

// User's Query:
// ${userQuery}

// Rules:
// 1. Start with: **PASS**, **WEAK**, or **FAIL**
// 2. Keep response SHORT (max 4-5 lines)

// If PASS:
// - Say "Correct!" 
// - Ask ONE follow-up question (optional)

// If WEAK/FAIL:
// - Give 1-2 specific hints (don't explain everything)
// - Don't give the answer yet
// - Tell them to try again

// Be direct and concise like a real interviewer.`;
//     }

//     // Call Groq API
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.5,
//         max_tokens: 500,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       console.error("Groq API error:", error);
//       return NextResponse.json(
//         { error: "Failed to evaluate query" },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();
//     let feedback = data.choices[0]?.message?.content || "Unable to generate feedback";
//     const verdict = extractVerdict(feedback);

//     // Store in database
//     if (clerkUserId && questionId && difficulty && topic) {
//       try {
//         const user = await prisma.user.upsert({
//           where: { clerkUserId: clerkUserId },
//           update: {},
//           create: { clerkUserId: clerkUserId, name: null },
//         });

//         const subject = await prisma.subject.upsert({
//           where: { slug: topic.toLowerCase().replace(/\s+/g, '-') },
//           update: {},
//           create: {
//             name: topic,
//             slug: topic.toLowerCase().replace(/\s+/g, '-'),
//             isActive: true,
//           },
//         });

//         const dbQuestion = await prisma.question.upsert({
//           where: { id: `sql-${questionId}` },
//           update: {},
//           create: {
//             id: `sql-${questionId}`,
//             subjectId: subject.id,
//             difficulty: mapDifficulty(difficulty),
//             isActive: true,
//           },
//         });

//         // Get existing attempt
//         const existingAttempt = await prisma.userQuestionAttempt.findUnique({
//           where: {
//             userId_questionId: {
//               userId: user.id,
//               questionId: dbQuestion.id,
//             },
//           },
//         });

//         let finalVerdict = verdict;
//         let cooldownUntil = null;
//         let failureCount = existingAttempt?.failureCount || 0;

//         // Logic: If first attempt and not PASS, mark as FAIL with cooldown
//         if (!existingAttempt && verdict !== Verdict.PASS) {
//           finalVerdict = Verdict.FAIL;
//           failureCount = 1;
//           cooldownUntil = new Date(Date.now() + getCooldownHours(failureCount) * 60 * 60 * 1000);
          
//           feedback += `\n\n⏳ **Question Locked for 24 hours**\n\nYou can retry after the cooldown period. Use this time to practice!`;
//         }
//         // If retrying after cooldown
//         else if (isRetryAfterCooldown) {
//           if (verdict === Verdict.PASS) {
//             // Success after retry - clear cooldown
//             finalVerdict = Verdict.PASS;
//             cooldownUntil = null;
//             failureCount = 0;
//           } else {
//             // Failed again - increase cooldown
//             finalVerdict = Verdict.FAIL;
//             failureCount = (existingAttempt?.failureCount || 0) + 1;
//             const cooldownHours = getCooldownHours(failureCount);
//             cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
            
//             feedback += `\n\n⏳ **Question Locked for ${cooldownHours} hours**\n\nYou've failed ${failureCount} time(s). Take time to study and come back!`;
//           }
//         }
//         // If follow-up resulted in FAIL (gave up or wrong after hints)
//         else if (followUp && verdict === Verdict.FAIL && !existingAttempt?.cooldownUntil) {
//           finalVerdict = Verdict.FAIL;
//           failureCount = 1;
//           cooldownUntil = new Date(Date.now() + getCooldownHours(failureCount) * 60 * 60 * 1000);
          
//           feedback += `\n\n⏳ **Question Locked for 24 hours**\n\nYou can retry after the cooldown period.`;
//         }

//         // Update or create attempt
//         await prisma.userQuestionAttempt.upsert({
//           where: {
//             userId_questionId: {
//               userId: user.id,
//               questionId: dbQuestion.id,
//             },
//           },
//           update: {
//             verdict: finalVerdict,
//             attemptedAt: new Date(),
//             cooldownUntil: cooldownUntil,
//             failureCount: failureCount,
//           },
//           create: {
//             userId: user.id,
//             questionId: dbQuestion.id,
//             subjectId: subject.id,
//             verdict: finalVerdict,
//             cooldownUntil: cooldownUntil,
//             failureCount: failureCount,
//           },
//         });

//         // Update subject summary
//         const allAttempts = await prisma.userQuestionAttempt.findMany({
//           where: { userId: user.id, subjectId: subject.id },
//         });

//         const solvedCount = allAttempts.filter(a => a.verdict === Verdict.PASS).length;
//         const failedCount = allAttempts.filter(a => a.verdict === Verdict.FAIL).length;

//         await prisma.userSubjectSummary.upsert({
//           where: {
//             userId_subjectId: {
//               userId: user.id,
//               subjectId: subject.id,
//             },
//           },
//           update: {
//             solvedCount,
//             failedCount,
//             lastActivity: new Date(),
//           },
//           create: {
//             userId: user.id,
//             subjectId: subject.id,
//             solvedCount,
//             failedCount,
//             lastActivity: new Date(),
//           },
//         });
//       } catch (dbError) {
//         console.error("Database error:", dbError);
//       }
//     }

//     return NextResponse.json({ feedback });
//   } catch (error) {
//     console.error("Error evaluating SQL:", error);
//     return NextResponse.json(
//       { error: "Failed to evaluate query" },
//       { status: 500 }
//     );
//   }
// }


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
  
  return Verdict.WEAK;
}

// Calculate cooldown period based on failure count
function getCooldownHours(failureCount: number): number {
  if (failureCount === 1) return 24; // 1 day
  if (failureCount === 2) return 72; // 3 days
  return 168; // 7 days for 3+ failures
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

    // Check cooldown status if this is first submission (not follow-up)
    if (!followUp && clerkUserId && questionId) {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkUserId: clerkUserId },
        });

        if (user) {
          const dbQuestionId = `sql-${questionId}`;
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
              feedback: `⏳ **COOLDOWN ACTIVE**\n\nYou failed this question previously. You can retry after **${hoursLeft} hours**.\n\nUse this time to:\n- Review SQL concepts\n- Practice similar problems\n- Study the schema carefully\n\nCome back stronger! 💪`,
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
    let isRetryAfterCooldown = false;
    let currentAttemptCount = 0;
    
    if (followUp && conversationHistory && userResponse) {
      // Count user attempts in conversation
      currentAttemptCount = conversationHistory.filter((msg: any) => msg.role === 'user').length;
      
      // After 3 attempts, show answer and lock
      const shouldShowAnswer = currentAttemptCount >= 3;
      
      prompt = `SQL Problem: ${question}
User's Query: ${userQuery}

${conversationHistory.slice(-6).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userResponse}

${shouldShowAnswer ? `
IMPORTANT: The user has tried 3 times. You MUST now:
1. Start with "**FAIL**" 
2. Show the COMPLETE CORRECT SQL query
3. Explain it briefly (2-3 lines)
4. Say "This question is now locked for 24 hours. Study this solution and retry later."

Keep explanation short but MUST show the full correct query.` : `The user has tried ${currentAttemptCount + 1} time(s). They get 3 total attempts.

Respond briefly and naturally:
- If still stuck, give a helpful hint
- Don't show the answer yet
- Encourage them to try again
- Remind: "You have ${3 - currentAttemptCount - 1} attempt(s) remaining"`}`;
    } else {
      // Check if this is a retry after cooldown
      if (clerkUserId && questionId) {
        try {
          const user = await prisma.user.findUnique({
            where: { clerkUserId: clerkUserId },
          });
          
          if (user) {
            const attempt = await prisma.userQuestionAttempt.findUnique({
              where: {
                userId_questionId: {
                  userId: user.id,
                  questionId: `sql-${questionId}`,
                },
              },
            });
            
            if (attempt && attempt.verdict === Verdict.FAIL && 
                (!attempt.cooldownUntil || new Date() >= attempt.cooldownUntil)) {
              isRetryAfterCooldown = true;
            }
          }
        } catch (err) {
          console.error("Retry check error:", err);
        }
      }

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
- Briefly explain why it's good
- Ask ONE follow-up question (optional)

If WEAK/FAIL:
- Give 1-2 specific hints (don't give answer)
- Tell them to try again
- Say "You have 2 more attempts remaining"

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
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 800,
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
    let feedback = data.choices[0]?.message?.content || "Unable to generate feedback";
    const verdict = extractVerdict(feedback);

    let shouldLockQuestion = false;
    let cooldownUntil = null;
    let finalVerdict = verdict;
    let failureCount = 0;

    // Store in database
    if (clerkUserId && questionId && difficulty && topic) {
      try {
        const user = await prisma.user.upsert({
          where: { clerkUserId: clerkUserId },
          update: {},
          create: { clerkUserId: clerkUserId, name: null },
        });

        const subject = await prisma.subject.upsert({
          where: { slug: topic.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            name: topic,
            slug: topic.toLowerCase().replace(/\s+/g, '-'),
            isActive: true,
          },
        });

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

        // Logic: Lock after 3 failed attempts (when AI shows answer)
        if (followUp && currentAttemptCount >= 3) {
          // User exhausted 3 attempts and AI gave answer - LOCK NOW
          finalVerdict = Verdict.FAIL;
          failureCount = failureCount + 1;
          const cooldownHours = getCooldownHours(failureCount);
          cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
          shouldLockQuestion = true;
          
          feedback += `\n\n⏳ **Question Locked for ${cooldownHours} hours**\n\nStudy the solution above and retry after the cooldown period.`;
        }
        // If retrying after cooldown
        else if (isRetryAfterCooldown) {
          if (verdict === Verdict.PASS) {
            // Success after retry - clear cooldown
            finalVerdict = Verdict.PASS;
            cooldownUntil = null;
            failureCount = 0;
          } else {
            // Failed again on first try after cooldown - give 3 attempts again (don't lock yet)
            finalVerdict = Verdict.WEAK;
          }
        }
        // Passed
        else if (verdict === Verdict.PASS) {
          finalVerdict = Verdict.PASS;
          cooldownUntil = null;
          failureCount = 0;
        }
        // First attempt or follow-up (not 3rd attempt yet)
        else {
          finalVerdict = verdict;
        }

        // Update or create attempt
        if (shouldLockQuestion || verdict === Verdict.PASS || !existingAttempt || isRetryAfterCooldown) {
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
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    return NextResponse.json({ 
      feedback,
      cooldown: shouldLockQuestion,
      cooldownUntil: cooldownUntil?.toISOString(),
      attemptCount: followUp ? currentAttemptCount + 1 : 1
    });
  } catch (error) {
    console.error("Error evaluating SQL:", error);
    return NextResponse.json(
      { error: "Failed to evaluate query" },
      { status: 500 }
    );
  }
}