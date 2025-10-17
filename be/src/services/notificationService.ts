import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class NotificationService {
  // Create notification
  static async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }) {
    return await prisma.notification.create({
      data,
    });
  }

  // Get user notifications
  static async getUserNotifications(userId: string, limit: number = 20, offset: number = 0) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // Mark all user notifications as read
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Get unread count
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // Delete notification
  static async deleteNotification(notificationId: string) {
    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
