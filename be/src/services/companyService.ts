import prisma from '../config/database'

export interface UpdateCompanyProfileData {
  companyName: string
  industryType?: string
  address?: string
  phoneNumber?: string
  website?: string
  description?: string
  contactPersonName?: string
  contactPersonEmail?: string
  contactPersonPhotoPath?: string
}

export async function updateCompanyProfile(userId: string, data: UpdateCompanyProfileData) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId }
  })

  if (!companyProfile) {
    throw new Error('Company profile not found')
  }

  return await prisma.companyProfile.update({
    where: { userId },
    data
  })
}

export async function uploadCompanyLogo(userId: string, file: File) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!companyProfile) {
    throw new Error('Company profile not found')
  }

  // In a real implementation, you would upload the file to a storage service
  const fileName = `${Date.now()}-${file.name}`
  const logoPath = `/uploads/logos/${fileName}`

  return await prisma.companyProfile.update({
    where: { userId },
    data: { logoPath }
  })
}

export async function getAllCompanies() {
  return await prisma.companyProfile.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true
        }
      },
      jobPostings: {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          jobTitle: true,
          createdAt: true
        }
      }
    }
  })
}

export async function getCompanyProfile(userId: string) {
  const company = await prisma.companyProfile.findUnique({
    where: { userId }
  })

  if (!company) {
    throw new Error('Company profile not found')
  }

  return company
}

export async function getCompanyDetail(userId: string) {
  const company = await prisma.companyProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true
        }
      },
      jobPostings: {
        include: {
          jobApplications: {
            select: {
              id: true,
              status: true,
              applicationDate: true
            }
          }
        }
      },
      directRecruitments: true
    }
  })

  if (!company) {
    throw new Error('Company not found')
  }

  return company
}
