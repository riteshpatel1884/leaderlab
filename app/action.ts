'use server';

import { prisma } from '@/lib/db'; // Ensure this path matches your project structure
import { currentUser } from '@clerk/nextjs/server';

// Define return type for actions
type ActionState = {
  success: boolean;
  message: string;
};

// Helper to get the CURRENT authenticated user or fallback to Guest
async function getUserForAction() {
  // 1. Try to get the real logged-in user from Clerk
  const clerkUser = await currentUser();

  if (clerkUser) {
    // Check if this user exists in your Postgres DB
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    // Sync: If logged into Clerk but not in DB yet, create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          name: clerkUser.firstName || clerkUser.username || "User",
        }
      });
    }

    return dbUser;
  }

  // 2. If NOT logged in, fall back to the Guest User
  // This ensures the form still works for public visitors
  const guestId = "guest_user_123";
  
  let guestUser = await prisma.user.findUnique({ where: { clerkUserId: guestId }});
  
  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        clerkUserId: guestId,
        name: "Guest User"
      }
    });
  }
  return guestUser;
}

export async function submitFeedback(formData: FormData): Promise<ActionState> {
  try {
    const feedback = formData.get('feedback') as string;
    const user = await getUserForAction();

    await prisma.feedback.create({
      data: {
        userId: user.id, // Links to the User table ID (CUID)
        username: user.name || "Anonymous",
        feedback: feedback,
      },
    });

    return { success: true, message: "Feedback received. Thank you!" };
  } catch (error) {
    console.error("Feedback Error:", error);
    return { success: false, message: "Failed to submit feedback." };
  }
}

export async function submitIssue(formData: FormData): Promise<ActionState> {
  try {
    const issueType = formData.get('issueType') as any; 
    const description = formData.get('description') as string;
    const user = await getUserForAction();

    await prisma.issue.create({
      data: {
        userId: user.id,
        username: user.name || "Anonymous",
        issueType: issueType,
        description: description,
      },
    });

    return { success: true, message: "Issue reported. We'll look into it." };
  } catch (error) {
    console.error("Issue Error:", error);
    return { success: false, message: "Failed to report issue." };
  }
}

export async function submitContribution(formData: FormData): Promise<ActionState> {
  try {
    const fullName = formData.get('fullName') as string;
    const subjectName = formData.get('subjectId') as string;
    const link = formData.get('link') as string;
    const user = await getUserForAction();

    // Find the subject ID based on the name selected
    const subject = await prisma.subject.findUnique({
        where: { slug: subjectName.toLowerCase() } // Assuming slug matches or use findFirst with name
    }) || await prisma.subject.findFirst({
        where: { name: subjectName }
    });

    if (!subject) {
        // Fallback or Error if subject not found in DB
        // For now, let's assume if it fails, we return error
        return { success: false, message: "Subject not found in database." };
    }

    await prisma.contribution.create({
      data: {
        userId: user.id,
        username: user.name || "Anonymous",
        fullName: fullName,
        subjectId: subject.id,
        link: link,
        status: "PENDING"
      },
    });

    return { success: true, message: "Contribution submitted for review!" };
  } catch (error) {
    console.error("Contribution Error:", error);
    return { success: false, message: "Failed to submit contribution." };
  }
}