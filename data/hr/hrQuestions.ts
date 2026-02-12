// src/data/hrQuestions.ts

export interface HRQuestion {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const hrQuestions: HRQuestion[] = [
  {
    id: 1,
    category: "Introduction",
    question: "Tell me about yourself.",
    answer: "Focus on the 'Present-Past-Future' model. Start with what you're doing now, mention a key past achievement relevant to the role, and end with why you're excited about this specific opportunity. Keep it under 2 minutes."
  },
  {
    id: 2,
    category: "Behavioral",
    question: "What is your greatest weakness?",
    answer: "Choose a real, minor professional weakness (e.g., public speaking or over-analyzing details). Immediately follow up with the specific steps you are taking to improve it. Show self-awareness and a growth mindset."
  },
  {
    id: 3,
    category: "Motivation",
    question: "Why should we hire you?",
    answer: "Don't just list skills. Connect your unique strengths directly to the company's specific pain points. Explain how your background makes you the 'plug-and-play' solution they need right now."
  },
  {
    id: 4,
    category: "Conflict",
    question: "Describe a time you dealt with a difficult coworker.",
    answer: "Use the STAR method (Situation, Task, Action, Result). Focus on the 'Action'—how you remained professional, communicated clearly, and found a resolution that benefited the project, not your ego."
  }
];