// lib/notifications.js
// Creates in-app notifications in the Notification table

import prisma from "@/lib/prisma"; // adjust path to your prisma client

/**
 * Create a notification record for a user.
 * @param {object} params
 * @param {string} params.clerkUserId
 * @param {string} params.type  - "application_added" | "followup_reminder" | "status_change"
 * @param {string} params.title
 * @param {string} params.body
 * @param {string} [params.applicationId]
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

/**
 * Get unread notification count for a user.
 */
export async function getUnreadCount(clerkUserId) {
  return prisma.notification.count({
    where: { clerkUserId, read: false },
  });
}

/**
 * Get recent notifications for a user (latest 30).
 */
export async function getNotifications(clerkUserId, limit = 30) {
  return prisma.notification.findMany({
    where: { clerkUserId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Mark a single notification as read.
 */
export async function markRead(id, clerkUserId) {
  return prisma.notification.updateMany({
    where: { id, clerkUserId },
    data: { read: true },
  });
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllRead(clerkUserId) {
  return prisma.notification.updateMany({
    where: { clerkUserId, read: false },
    data: { read: true },
  });
}