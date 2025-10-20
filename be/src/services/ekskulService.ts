import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const getAllEkskul = async (params?: { limit?: number; offset?: number; kategori?: string }) => {
  const { limit = 10, offset = 0, kategori } = params || {};

  const ekskul = await prisma.ekskul.findMany({
    where: kategori ? { kategori: { contains: kategori } } : {},
    include: {
      manager: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  const total = await prisma.ekskul.count({
    where: kategori ? { kategori: { contains: kategori } } : {},
  });

  return {
    success: true,
    data: ekskul,
    total,
    limit,
    offset,
  };
};

export const getEkskulById = async (id: string) => {
  const ekskul = await prisma.ekskul.findUnique({
    where: { id },
    include: {
      manager: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!ekskul) {
    return {
      success: false,
      error: 'Ekskul not found',
    };
  }

  return {
    success: true,
    data: ekskul,
  };
};

export const createEkskul = async (data: {
  namaEkskul: string;
  deskripsi?: string;
  kategori?: string;
  status?: string;
  userInternal?: string;
}) => {
  try {
    const ekskul = await prisma.ekskul.create({
      data: {
        namaEkskul: data.namaEkskul,
        deskripsi: data.deskripsi,
        kategori: data.kategori,
        status: data.status,
        userInternal: data.userInternal,
      },
      include: {
        manager: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: ekskul,
    };
  } catch (error) {
    console.error('Error creating ekskul:', error);
    return {
      success: false,
      error: 'Failed to create ekskul',
    };
  }
};

export const updateEkskul = async (
  id: string,
  data: {
    namaEkskul?: string;
    deskripsi?: string;
    kategori?: string;
    status?: string;
    userInternal?: string;
  }
) => {
  try {
    const ekskul = await prisma.ekskul.update({
      where: { id },
      data: {
        ...(data.namaEkskul && { namaEkskul: data.namaEkskul }),
        ...(data.deskripsi !== undefined && { deskripsi: data.deskripsi }),
        ...(data.kategori !== undefined && { kategori: data.kategori }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.userInternal !== undefined && { userInternal: data.userInternal }),
      },
      include: {
        manager: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: ekskul,
    };
  } catch (error) {
    console.error('Error updating ekskul:', error);
    return {
      success: false,
      error: 'Failed to update ekskul',
    };
  }
};

export const deleteEkskul = async (id: string) => {
  try {
    await prisma.ekskul.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Ekskul deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting ekskul:', error);
    return {
      success: false,
      error: 'Failed to delete ekskul',
    };
  }
};
