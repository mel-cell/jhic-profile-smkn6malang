import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class MessageService {
  // Send message
  static async sendMessage(data: {
    senderId: string;
    receiverId: string;
    subject?: string;
    content: string;
  }) {
    return await prisma.message.create({
      data,
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  // Get user messages (sent and received)
  static async getUserMessages(userId: string, limit: number = 20, offset: number = 0) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get conversation between two users
  static async getConversation(userId1: string, userId2: string, limit: number = 50, offset: number = 0) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get message by ID
  static async getMessageById(messageId: string) {
    return await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  // Mark message as read
  static async markAsRead(messageId: string) {
    return await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  // Mark all messages from sender as read
  static async markAllAsRead(userId: string, senderId: string) {
    return await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // Get unread message count
  static async getUnreadCount(userId: string) {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  // Get unread count from specific sender
  static async getUnreadCountFromSender(userId: string, senderId: string) {
    return await prisma.message.count({
      where: {
        senderId,
        receiverId: userId,
        isRead: false,
      },
    });
  }

  // Delete message
  static async deleteMessage(messageId: string) {
    return await prisma.message.delete({
      where: { id: messageId },
    });
  }

  // Get list of users who have messaged the current user
  static async getMessageContacts(userId: string) {
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const contactIds = Array.from(
      new Set([
        ...sentMessages.map(m => m.receiverId),
        ...receivedMessages.map(m => m.senderId),
      ])
    );

    // Get user details for contacts
    const contacts = await prisma.user.findMany({
      where: {
        id: { in: contactIds },
      },
      select: {
        id: true,
        email: true,
        role: true,
        studentProfile: {
          select: {
            fullName: true,
          },
        },
        companyProfile: {
          select: {
            companyName: true,
          },
        },
      },
    });

    return contacts;
  }
}
