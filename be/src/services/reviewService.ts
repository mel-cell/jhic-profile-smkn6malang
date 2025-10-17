import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class ReviewService {
  // Create review
  static async createReview(data: {
    studentProfileId: string;
    companyProfileId: string;
    jobApplicationId?: string;
    rating: number;
    title: string;
    comment?: string;
    isAnonymous?: boolean;
  }) {
    return await prisma.review.create({
      data,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
        companyProfile: true,
        jobApplication: true,
      },
    });
  }

  // Get company reviews
  static async getCompanyReviews(companyProfileId: string, limit: number = 20, offset: number = 0) {
    return await prisma.review.findMany({
      where: { companyProfileId },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
        jobApplication: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get student reviews
  static async getStudentReviews(studentProfileId: string, limit: number = 20, offset: number = 0) {
    return await prisma.review.findMany({
      where: { studentProfileId },
      include: {
        companyProfile: true,
        jobApplication: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Get review by ID
  static async getReviewById(reviewId: string) {
    return await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
        companyProfile: true,
        jobApplication: true,
      },
    });
  }

  // Update review
  static async updateReview(reviewId: string, data: {
    rating?: number;
    title?: string;
    comment?: string;
    isAnonymous?: boolean;
  }) {
    return await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
        companyProfile: true,
        jobApplication: true,
      },
    });
  }

  // Delete review
  static async deleteReview(reviewId: string) {
    return await prisma.review.delete({
      where: { id: reviewId },
    });
  }

  // Get average rating for company
  static async getCompanyAverageRating(companyProfileId: string) {
    const result = await prisma.review.aggregate({
      where: { companyProfileId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }
}
