import prisma from '../config/database'

export interface CreateJobData {
  jobTitle: string
  description?: string
  requirements?: string
  location?: string
  salaryRange?: string
  employmentType?: string
  applicationDeadline?: string
  notes?: string
}

export async function createJob(userId: string, data: CreateJobData) {
  // Find the company profile for the user
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!companyProfile) {
    throw new Error('Company profile not found')
  }

  // Create the job posting with APPROVED status for auto-approval
  return await prisma.jobPosting.create({
    data: {
      companyProfileId: companyProfile.id,
      ...data,
      status: 'APPROVED'
    },
    include: {
      companyProfile: {
        select: {
          companyName: true
        }
      }
    }
  })
}

export async function getMyJobs(userId: string) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!companyProfile) {
    throw new Error('Company profile not found')
  }

  return await prisma.jobPosting.findMany({
    where: { companyProfileId: companyProfile.id },
    orderBy: { createdAt: 'desc' },
    include: {
      companyProfile: {
        select: {
          companyName: true
        }
      }
    }
  })
}

export async function getJobById(jobId: string) {
  return await prisma.jobPosting.findUnique({
    where: { id: jobId },
    include: {
      companyProfile: {
        select: {
          id: true,
          userId: true,
          companyName: true,
          industryType: true,
          logoPath: true
        }
      },
      jobApplications: {
        include: {
          studentProfile: {
            select: {
              fullName: true,
              major: true,
              profilePhotoPath: true
            }
          },
          studentCv: {
            select: {
              filePath: true,
              fileName: true
            }
          }
        }
      }
    }
  })
}

export async function updateJob(jobId: string, data: Partial<CreateJobData> & { status?: string }) {
  return await prisma.jobPosting.update({
    where: { id: jobId },
    data,
    include: {
      companyProfile: {
        select: {
          companyName: true
        }
      }
    }
  })
}

export async function deleteJob(jobId: string) {
  return await prisma.jobPosting.delete({
    where: { id: jobId }
  })
}

export async function getJobApplications(jobId: string) {
  return await prisma.jobApplication.findMany({
    where: { jobPostingId: jobId },
    include: {
      studentProfile: {
        select: {
          id: true,
          fullName: true,
          major: true,
          profilePhotoPath: true
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      },
      studentCv: {
        select: {
          filePath: true
        }
      }
    },
    orderBy: { applicationDate: 'desc' }
  })
}
