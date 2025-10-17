import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class InterviewService {
  // Schedule interview
  static async scheduleInterview(data: {
    jobApplicationId: string;
    scheduledAt: Date;
    location?: string;
    interviewType: string;
    notes?: string;
  }) {
    return await prisma.interview.create({
      data,
      include: {
        jobApplication: {
          include: {
            studentProfile: {
              include: {
                user: true,
              },
            },
            jobPosting: {
              include: {
                companyProfile: true,
              },
            },
          },
        },
      },
    });
  }

  // Get interview by ID
  static async getInterviewById(interviewId: string) {
    return await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        jobApplication: {
          include: {
            studentProfile: {
              include: {
                user: true,
              },
            },
            jobPosting: {
              include: {
                companyProfile: true,
              },
            },
          },
        },
      },
    });
  }

  // Get interviews for job application
  static async getInterviewsForApplication(jobApplicationId: string) {
    return await prisma.interview.findMany({
      where: { jobApplicationId },
      orderBy: { scheduledAt: 'asc' },
      include: {
        jobApplication: {
          include: {
            studentProfile: {
              include: {
                user: true,
              },
            },
            jobPosting: {
              include: {
                companyProfile: true,
              },
            },
          },
        },
      },
    });
  }

  // Update interview
  static async updateInterview(interviewId: string, data: {
    scheduledAt?: Date;
    location?: string;
    interviewType?: string;
    notes?: string;
    status?: string;
    feedback?: string;
    rating?: number;
  }) {
    return await prisma.interview.update({
      where: { id: interviewId },
      data,
      include: {
        jobApplication: {
          include: {
            studentProfile: {
              include: {
                user: true,
              },
            },
            jobPosting: {
              include: {
                companyProfile: true,
              },
            },
          },
        },
      },
    });
  }

  // Cancel interview
  static async cancelInterview(interviewId: string) {
    return await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'CANCELLED' },
    });
  }

  // Complete interview
  static async completeInterview(interviewId: string, feedback?: string, rating?: number) {
    return await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'COMPLETED',
        feedback,
        rating,
      },
    });
  }

  // Get upcoming interviews for user
  static async getUpcomingInterviews(userId: string, role: string) {
    const now = new Date();

    if (role === 'STUDENT') {
      return await prisma.interview.findMany({
        where: {
          jobApplication: {
            studentProfile: {
              userId,
            },
          },
          scheduledAt: {
            gte: now,
          },
          status: 'SCHEDULED',
        },
        include: {
          jobApplication: {
            include: {
              jobPosting: {
                include: {
                  companyProfile: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
      });
    } else if (role === 'COMPANY') {
      return await prisma.interview.findMany({
        where: {
          jobApplication: {
            jobPosting: {
              companyProfile: {
                userId,
              },
            },
          },
          scheduledAt: {
            gte: now,
          },
          status: 'SCHEDULED',
        },
        include: {
          jobApplication: {
            include: {
              studentProfile: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
      });
    }

    return [];
  }
}
