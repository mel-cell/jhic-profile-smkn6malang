import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPrestasi = async (params?: { limit?: number; offset?: number; kategori?: string }) => {
  const { limit = 10, offset = 0, kategori } = params || {};

  const prestasi = await prisma.prestasi.findMany({
    where: kategori ? { competitionLevel: { contains: kategori } } : {},
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          nis: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  const total = await prisma.prestasi.count({
    where: kategori ? { competitionLevel: { contains: kategori } } : {},
  });

  return {
    success: true,
    data: prestasi,
    total,
    limit,
    offset,
  };
};

export const getPrestasiById = async (id: string) => {
  const prestasi = await prisma.prestasi.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          nis: true,
        },
      },
    },
  });

  if (!prestasi) {
    return {
      success: false,
      error: 'Prestasi not found',
    };
  }

  return {
    success: true,
    data: prestasi,
  };
};

export const createPrestasi = async (data: {
  title: string;
  studentId: string;
  competitionLevel: string;
  organizer: string;
  date: string;
  imagePath?: string;
}) => {
  try {
    const prestasi = await prisma.prestasi.create({
      data: {
        title: data.title,
        studentId: data.studentId,
        competitionLevel: data.competitionLevel,
        organizer: data.organizer,
        date: new Date(data.date),
        imagePath: data.imagePath,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            nis: true,
          },
        },
      },
    });

    return {
      success: true,
      data: prestasi,
    };
  } catch (error) {
    console.error('Error creating prestasi:', error);
    return {
      success: false,
      error: 'Failed to create prestasi',
    };
  }
};

export const updatePrestasi = async (
  id: string,
  data: {
    title?: string;
    studentId?: string;
    competitionLevel?: string;
    organizer?: string;
    date?: string;
    imagePath?: string;
  }
) => {
  try {
    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.studentId && { studentId: data.studentId }),
        ...(data.competitionLevel && { competitionLevel: data.competitionLevel }),
        ...(data.organizer && { organizer: data.organizer }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            nis: true,
          },
        },
      },
    });

    return {
      success: true,
      data: prestasi,
    };
  } catch (error) {
    console.error('Error updating prestasi:', error);
    return {
      success: false,
      error: 'Failed to update prestasi',
    };
  }
};

export const deletePrestasi = async (id: string) => {
  try {
    await prisma.prestasi.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Prestasi deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting prestasi:', error);
    return {
      success: false,
      error: 'Failed to delete prestasi',
    };
  }
};
