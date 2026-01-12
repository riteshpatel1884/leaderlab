// user.ts
import { prisma } from './db';
import { currentUser } from '@clerk/nextjs/server';

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  // Check if user exists in database
  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  // Create user if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: clerkUser.firstName || clerkUser.username || null,
      },
    });
  }

  return user;
}

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  return user;
}
