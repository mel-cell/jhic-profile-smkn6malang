import prisma from '../config/database'

export interface CreateNewsData {
  judul: string
  content: string
  imagePath?: string
  kategori?: string
}

export interface UpdateNewsData {
  title?: string
  content?: string
  imagePath?: string
  category?: string
  status?: string
}

export interface CreateExtracurricularData {
  namaEkskul: string
  deskripsi?: string
  kategori?: string
  status?: string
}

export interface UpdateExtracurricularData {
  namaEkskul?: string
  deskripsi?: string
  kategori?: string
  status?: string
}

// News functions
export async function getAllNews() {
  return await prisma.berita.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getNewsDetail(newsId: string) {
  const news = await prisma.berita.findUnique({
    where: { id: newsId }
  })

  if (!news) {
    throw new Error('News not found')
  }

  return news
}

export async function createNews(userId: string, data: CreateNewsData) {
  return await prisma.berita.create({
    data: {
      userId,
      ...data
    }
  })
}

export async function updateNews(newsId: string, userId: string, data: UpdateNewsData, isAdmin: boolean = false) {
  const news = await prisma.berita.findUnique({
    where: { id: newsId }
  })

  if (!news) {
    throw new Error('News not found')
  }

  if (!isAdmin && news.userId !== userId) {
    throw new Error('Unauthorized to update this news')
  }

  return await prisma.berita.update({
    where: { id: newsId },
    data
  })
}

export async function deleteNews(newsId: string, userId: string, isAdmin: boolean = false) {
  const news = await prisma.berita.findUnique({
    where: { id: newsId }
  })

  if (!news) {
    throw new Error('News not found')
  }

  if (!isAdmin && news.userId !== userId) {
    throw new Error('Unauthorized to delete this news')
  }

  await prisma.berita.delete({
    where: { id: newsId }
  })

  return { success: true }
}

// Extracurricular functions
export async function getAllExtracurriculars() {
  return await prisma.ekskul.findMany({
    where: { status: 'ACTIVE' },
    include: {
      manager: {
        select: {
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getExtracurricularDetail(ekskulId: string) {
  const ekskul = await prisma.ekskul.findUnique({
    where: { id: ekskulId },
    include: {
      manager: {
        select: {
          email: true
        }
      }
    }
  })

  if (!ekskul) {
    throw new Error('Extracurricular not found')
  }

  return ekskul
}

export async function createExtracurricular(userId: string, data: CreateExtracurricularData) {
  return await prisma.ekskul.create({
    data: {
      userInternal: userId,
      ...data,
      status: data.status || 'ACTIVE'
    }
  })
}

export async function updateExtracurricular(ekskulId: string, userId: string, data: UpdateExtracurricularData, isAdmin: boolean = false) {
  const ekskul = await prisma.ekskul.findUnique({
    where: { id: ekskulId }
  })

  if (!ekskul) {
    throw new Error('Extracurricular not found')
  }

  if (!isAdmin && ekskul.userInternal !== userId) {
    throw new Error('Unauthorized to update this extracurricular')
  }

  return await prisma.ekskul.update({
    where: { id: ekskulId },
    data
  })
}

export async function deleteExtracurricular(ekskulId: string, userId: string, isAdmin: boolean = false) {
  const ekskul = await prisma.ekskul.findUnique({
    where: { id: ekskulId }
  })

  if (!ekskul) {
    throw new Error('Extracurricular not found')
  }

  if (!isAdmin && ekskul.userInternal !== userId) {
    throw new Error('Unauthorized to delete this extracurricular')
  }

  await prisma.ekskul.delete({
    where: { id: ekskulId }
  })

  return { success: true }
}

// Jobs functions
export async function getAllJobs() {
  return await prisma.jobPosting.findMany({
    where: { status: 'APPROVED' },
    include: {
      companyProfile: {
        select: {
          companyName: true,
          industryType: true,
          logoPath: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getJobDetail(jobId: string) {
  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId, status: 'APPROVED' },
    include: {
      companyProfile: {
        select: {
          companyName: true,
          industryType: true,
          logoPath: true,
          description: true,
          address: true,
          website: true
        }
      }
    }
  })

  if (!job) {
    throw new Error('Job not found')
  }

  return job
}

// Get similar jobs (same company or same industry)
export async function getSimilarJobs(jobId: string, limit: number = 5) {
  const currentJob = await prisma.jobPosting.findUnique({
    where: { id: jobId },
    include: {
      companyProfile: true
    }
  })

  if (!currentJob) {
    return []
  }

  // Get jobs from same company or same industry, excluding current job
  const similarJobs = await prisma.jobPosting.findMany({
    where: {
      status: 'APPROVED',
      OR: [
        { companyProfileId: currentJob.companyProfileId },
        { companyProfile: { industryType: currentJob.companyProfile.industryType } }
      ],
      NOT: { id: jobId }
    },
    include: {
      companyProfile: {
        select: {
          companyName: true,
          industryType: true,
          logoPath: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  return similarJobs
}

export async function getAllApprovedJobs() {
  return await prisma.jobPosting.findMany({
    where: { status: 'APPROVED' },
    include: {
      companyProfile: {
        select: {
          companyName: true,
          industryType: true,
          logoPath: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}
