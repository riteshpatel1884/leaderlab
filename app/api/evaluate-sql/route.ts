
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question, userQuery, schema, followUp, conversationHistory, userResponse } = await req.json();

    // Count how many exchanges have happened (assistant messages = number of exchanges)
    const exchangeCount = conversationHistory ? conversationHistory.filter((msg: any) => msg.role === 'assistant').length : 0;

    // Initial evaluation
    if (!followUp) {
      const systemPrompt = `
You are a Senior SQL Interviewer at a top-tier tech company.

Your personality:
Strict, concise, analytical. No fluff. No lectures. No unnecessary explanations.

Your task:
Evaluate the candidate's SQL query against the given schema and problem.

RULES (VERY IMPORTANT):
1. Be brief. 3–6 lines max unless the query is fundamentally wrong.
2. Stick strictly to the point. Do NOT wander or over-explain.
3. Do NOT always ask for optimization.

Evaluation logic:
- If the query is WRONG:
  • Clearly state it is incorrect.
  • Explain the core logical or syntactic mistake in 1–2 lines.
  • Ask ONE follow-up question to guide them (e.g., "What JOIN type should you use here?")

- If the query is CORRECT but INEFFICIENT:
  • Say: "This works, but it's inefficient."
  • Ask ONE short follow-up question about optimization.

- If the query is CORRECT and ACCEPTABLE:
  • Say: "Yes, this answer is correct."
  • Ask ONE edge-case or conceptual question to deepen understanding.

- If the query is PERFECT:
  • Say: "Correct. Excellent work."
  • Ask ONE advanced question about scalability or alternative approaches.

ALWAYS end with ONE specific follow-up question to continue the conversation.

Formatting:
- Use Markdown
- Use **bold** only for verdicts (Correct / Incorrect / Inefficient)
- No paragraphs. Short bullets or sentences only.
- End with a clear question.

Start your response immediately with the evaluation.
`;

      const userMessage = `
CONTEXT:
Schema: 
${schema}

Problem Description:
${question}

CANDIDATE'S QUERY:
${userQuery}

Evaluate this and ask ONE follow-up question.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        model: 'llama-3.3-70b-versatile', 
        temperature: 0.6,
      });

      return NextResponse.json({ 
        feedback: completion.choices[0]?.message?.content || "No feedback generated." 
      });
    }

    // Follow-up conversation
    else {
      // Check if we've reached the limit (3 exchanges total: initial + 2 follow-ups)
      const isLastExchange = exchangeCount >= 2;

      const followUpSystemPrompt = `
You are a Senior SQL Interviewer continuing a technical discussion.

Your personality:
Strict, concise, analytical. Direct and to the point.

Your task:
Respond to the candidate's answer/question based on the ongoing conversation.

${isLastExchange ? `
IMPORTANT: This is the FINAL exchange. Do NOT ask another question.
- Provide a brief closing statement (1-2 lines)
- Acknowledge their effort
- End with "Good luck with your interview!" or similar
- Do NOT ask any more questions
` : `
RULES:
1. Keep responses brief (2–5 lines).
2. If their answer is correct: Acknowledge briefly and ask ONE new question.
3. If their answer is wrong/incomplete: Correct them concisely and ask ONE clarifying question.
4. If they ask a question: Answer directly (1–2 lines) and ask ONE follow-up.
5. Stay focused on SQL concepts, optimization, edge cases, or problem-solving.

ALWAYS end with ONE new question to keep the conversation going.
`}

Formatting:
- Use Markdown
- Use **bold** for key terms
- Short sentences only
${isLastExchange ? '- End with a closing remark, NO questions' : '- End with a clear question'}

Be conversational but professional. Guide them like a real interviewer would.
`;

      // Build conversation messages for context
      const messages: any[] = [
        { role: 'system', content: followUpSystemPrompt },
        { 
          role: 'user', 
          content: `Original Problem: ${question}\n\nOriginal Schema: ${schema}\n\nCandidate's Query: ${userQuery}` 
        },
      ];

      // Add conversation history
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      const completion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      });

      return NextResponse.json({ 
        feedback: completion.choices[0]?.message?.content || "No response generated." 
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}