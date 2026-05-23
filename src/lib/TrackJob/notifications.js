// lib/TrackJob/notifications.js
import { prisma } from "../db";

/**
 * Create a notification record for a user.
 * type: "application_added" | "followup_reminder" | "status_change" | "admin_message"
 */
export async function createNotification({ clerkUserId, type, title, body, applicationId }) {
  return prisma.notification.create({
    data: {
      clerkUserId,
      type,
      title,
      body,
      applicationId: applicationId ?? null,
    },
  });
}

export async function getUnreadCount(clerkUserId) {
  return prisma.notification.count({
    where: { clerkUserId, read: false },
  });
}

export async function getNotifications(clerkUserId, limit = 30) {
  return prisma.notification.findMany({
    where: { clerkUserId },
    orderBy: { createdAt: "desc" }, // newest first — no manual grouping needed
    take: limit,
  });
}

export async function markRead(id, clerkUserId) {
  return prisma.notification.updateMany({
    where: { id, clerkUserId },
    data: { read: true },
  });
}

export async function markAllRead(clerkUserId) {
  return prisma.notification.updateMany({
    where: { clerkUserId, read: false },
    data: { read: true },
  });
}

/**
 * Permanently delete a single notification.
 * Scoped to clerkUserId so users can only delete their own.
 */
export async function deleteNotification(id, clerkUserId) {
  return prisma.notification.deleteMany({
    where: { id, clerkUserId },
  });
}