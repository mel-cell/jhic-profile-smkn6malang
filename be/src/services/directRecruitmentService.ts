import prisma from '../config/database'

export interface CreateDirectRecruitmentData {
  companyProfileId: string
  studentProfileId: string
  userId?: string
  message?: string
  notes?: string
}

export interface DirectRecruitmentFilters {
  companyProfileId?: string
  studentProfileId?: string
  status?: string
  userId?: string
}

export async function getDirectRecruitments(filters: DirectRecruitmentFilters = {}) {
  return await prisma.directRecruitment.findMany({
    where: filters,
    include: {
      companyProfile: {
        include: {
          user: true
        }
      },
      studentProfile: {
        include: {
          user: true
        }
      },
      recruiter: true
    },
    orderBy: {
      recruitedAt: 'desc'
    }
  })
}

export async function createDirectRecruitment(data: CreateDirectRecruitmentData) {
  // Check if direct recruitment already exists
  const existing = await prisma.directRecruitment.findUnique({
    where: {
      companyProfileId_studentProfileId: {
        companyProfileId: data.companyProfileId,
        studentProfileId: data.studentProfileId
      }
    }
  })

  if (existing) {
    throw new Error('Direct recruitment already exists for this company and student')
  }

  return await prisma.directRecruitment.create({
    data: {
      companyProfileId: data.companyProfileId,
      studentProfileId: data.studentProfileId,
      userId: data.userId,
      message: data.message,
      notes: data.notes
    },
    include: {
      companyProfile: {
        include: {
          user: true
        }
      },
      studentProfile: {
        include: {
          user: true
        }
      },
      recruiter: true
    }
  })
}

export async function updateDirectRecruitmentStatus(id: string, status: string, notes?: string) {
  const updateData: any = {
    status,
    lastStatusUpdate: new Date()
  }

  if (notes) {
    updateData.notes = notes
  }

  return await prisma.directRecruitment.update({
    where: { id },
    data: updateData,
    include: {
      companyProfile: {
        include: {
          user: true
        }
      },
      studentProfile: {
        include: {
          user: true
        }
      },
      recruiter: true
    }
  })
}

export async function getDirectRecruitmentById(id: string) {
  return await prisma.directRecruitment.findUnique({
    where: { id },
    include: {
      companyProfile: {
        include: {
          user: true
        }
      },
      studentProfile: {
        include: {
          user: true
        }
      },
      recruiter: true
    }
  })
}
