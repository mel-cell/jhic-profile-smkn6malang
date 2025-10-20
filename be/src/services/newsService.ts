import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllNews = async (params?: { limit?: number; offset?: number; kategori?: string }) => {
  const { limit = 10, offset = 0, kategori } = params || {};

  const news = await prisma.berita.findMany({
    where: kategori ? { kategori: { contains: kategori } } : {},
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  const total = await prisma.berita.count({
    where: kategori ? { kategori: { contains: kategori } } : {},
  });

  return {
    success: true,
    data: news,
    total,
    limit,
    offset,
  };
};

export const getNewsById = async (id: string) => {
  const news = await prisma.berita.findUnique({
    where: { id },
  });

  if (!news) {
    return {
      success: false,
      error: 'News not found',
    };
  }

  return {
    success: true,
    data: news,
  };
};

export const createNews = async (data: {
  judul: string;
  content: string;
  imagePath?: string;
  kategori?: string;
}) => {
  try {
    const news = await prisma.berita.create({
      data: {
        judul: data.judul,
        content: data.content,
        imagePath: data.imagePath,
        kategori: data.kategori,
      },
    });

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    console.error('Error creating news:', error);
    return {
      success: false,
      error: 'Failed to create news',
    };
  }
};

export const updateNews = async (
  id: string,
  data: {
    judul?: string;
    content?: string;
    imagePath?: string;
    kategori?: string;
  }
) => {
  try {
    const news = await prisma.berita.update({
      where: { id },
      data: {
        ...(data.judul && { judul: data.judul }),
        ...(data.content && { content: data.content }),
        ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
        ...(data.kategori !== undefined && { kategori: data.kategori }),
      },
    });

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    console.error('Error updating news:', error);
    return {
      success: false,
      error: 'Failed to update news',
    };
  }
};

export const deleteNews = async (id: string) => {
  try {
    await prisma.berita.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'News deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting news:', error);
    return {
      success: false,
      error: 'Failed to delete news',
    };
  }
};
