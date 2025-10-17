import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class BookmarkService {
  // Add bookmark
  static async addBookmark(data: {
    studentProfileId: string;
    jobPostingId: string;
  }) {
    return await prisma.bookmark.create({
      data,
      include: {
        jobPosting: {
          include: {
            companyProfile: true,
          },
        },
      },
    });
  }

  // Remove bookmark
  static async removeBookmark(studentProfileId: string, jobPostingId: string) {
    return await prisma.bookmark.deleteMany({
      where: {
        studentProfileId,
        jobPostingId,
      },
    });
  }

  // Get student bookmarks
  static async getStudentBookmarks(studentProfileId: string, limit: number = 20, offset: number = 0) {
    return await prisma.bookmark.findMany({
      where: { studentProfileId },
      include: {
        jobPosting: {
          include: {
            companyProfile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Check if job is bookmarked
  static async isBookmarked(studentProfileId: string, jobPostingId: string) {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        studentProfileId,
        jobPostingId,
      },
    });
    return !!bookmark;
  }

  // Get bookmark count for job
  static async getBookmarkCount(jobPostingId: string) {
    return await prisma.bookmark.count({
      where: { jobPostingId },
    });
  }
}
