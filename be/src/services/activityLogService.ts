import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class ActivityLogService {
  // Log activity
  static async logActivity(data: {
    userId?: string;
    action: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return await prisma.activityLog.create({
      data,
    });
  }

  // Get user activity logs
  static async getUserActivityLogs(userId: string, limit: number = 50, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get all activity logs (for admin)
  static async getAllActivityLogs(limit: number = 100, offset: number = 0) {
    return await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get activity logs by action
  static async getActivityLogsByAction(action: string, limit: number = 50, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: { action },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get activity logs by date range
  static async getActivityLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get activity statistics
  static async getActivityStats(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [totalActivities, userActivities, systemActivities, actionStats] = await Promise.all([
      prisma.activityLog.count({ where: whereClause }),
      prisma.activityLog.count({ where: { ...whereClause, userId: { not: null } } }),
      prisma.activityLog.count({ where: { ...whereClause, userId: null } }),
      prisma.activityLog.groupBy({
        by: ['action'],
        where: whereClause,
        _count: {
          action: true,
        },
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalActivities,
      userActivities,
      systemActivities,
      topActions: actionStats,
    };
  }

  // Clean old logs (for maintenance)
  static async cleanOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }
}
