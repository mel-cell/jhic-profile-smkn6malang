import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class PortfolioService {
  // Create portfolio item
  static async createPortfolio(data: {
    studentProfileId: string;
    title: string;
    description?: string;
    filePath?: string;
    fileType?: string;
    url?: string;
    isPublic?: boolean;
  }) {
    return await prisma.portfolio.create({
      data,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // Get student portfolios
  static async getStudentPortfolios(studentProfileId: string, isPublicOnly: boolean = false) {
    const whereClause: any = { studentProfileId };
    if (isPublicOnly) {
      whereClause.isPublic = true;
    }

    return await prisma.portfolio.findMany({
      where: whereClause,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get portfolio by ID
  static async getPortfolioById(portfolioId: string) {
    return await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // Update portfolio
  static async updatePortfolio(portfolioId: string, data: {
    title?: string;
    description?: string;
    filePath?: string;
    fileType?: string;
    url?: string;
    isPublic?: boolean;
  }) {
    return await prisma.portfolio.update({
      where: { id: portfolioId },
      data,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // Delete portfolio
  static async deletePortfolio(portfolioId: string) {
    return await prisma.portfolio.delete({
      where: { id: portfolioId },
    });
  }

  // Get public portfolios for all students (for companies to browse)
  static async getPublicPortfolios(limit: number = 50, offset: number = 0) {
    return await prisma.portfolio.findMany({
      where: { isPublic: true },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Search portfolios by title or description
  static async searchPortfolios(query: string, isPublicOnly: boolean = true) {
    const whereClause: any = {
      AND: [
        { isPublic: isPublicOnly },
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    };

    return await prisma.portfolio.findMany({
      where: whereClause,
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
