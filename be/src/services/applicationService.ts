import prisma from '../config/database'

export interface ApplyForJobData {
  studentCvId: string
  notes?: string
}

export async function applyForJob(userId: string, jobId: string, data: ApplyForJobData) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!studentProfile) {
    throw new Error('Student profile not found')
  }

  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id: jobId }
  })

  if (!jobPosting) {
    throw new Error('Job posting not found')
  }

  if (jobPosting.status !== 'ACTIVE') {
    throw new Error('Job posting is not active')
  }

  // Check if student already applied
  const existingApplication = await prisma.jobApplication.findUnique({
    where: {
      studentProfileId_jobPostingId: {
        studentProfileId: studentProfile.id,
        jobPostingId: jobId
      }
    }
  })

  if (existingApplication) {
    throw new Error('You have already applied for this job')
  }

  // Verify CV belongs to student
  const cv = await prisma.studentCvs.findUnique({
    where: { id: data.studentCvId }
  })

  if (!cv || cv.studentProfileId !== studentProfile.id) {
    throw new Error('CV not found or does not belong to you')
  }

  return await prisma.jobApplication.create({
    data: {
      studentProfileId: studentProfile.id,
      jobPostingId: jobId,
      studentCvId: data.studentCvId,
      notes: data.notes
    }
  })
}

export async function getMyApplications(userId: string) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!studentProfile) {
    throw new Error('Student profile not found')
  }

  return await prisma.jobApplication.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      jobPosting: {
        include: {
          companyProfile: {
            select: {
              companyName: true,
              industryType: true,
              logoPath: true
            }
          }
        }
      },
      studentCv: {
        select: {
          fileName: true,
          uploadedAt: true
        }
      }
    },
    orderBy: { applicationDate: 'desc' }
  })
}

export async function updateApplicationStatus(applicationId: string, status: string, userId: string, isAdmin: boolean = false) {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      jobPosting: {
        include: {
          companyProfile: true
        }
      }
    }
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (!isAdmin && application.jobPosting.companyProfile.userId !== userId) {
    throw new Error('Unauthorized to update this application')
  }

  return await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status,
      lastStatusUpdate: new Date()
    }
  })
}

export async function getAllApplications(isAdmin: boolean = false) {
  if (!isAdmin) {
    throw new Error('Only admins can view all applications')
  }

  return await prisma.jobApplication.findMany({
    include: {
      studentProfile: {
        select: {
          fullName: true,
          user: {
            select: {
              email: true
            }
          }
        }
      },
      jobPosting: {
        select: {
          jobTitle: true,
          companyProfile: {
            select: {
              companyName: true
            }
          }
        }
      },
      studentCv: {
        select: {
          fileName: true
        }
      }
    },
    orderBy: { applicationDate: 'desc' }
  })
}

export async function deleteApplication(applicationId: string, userId: string) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  })

  if (!studentProfile) {
    throw new Error('Student profile not found')
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      jobPosting: true
    }
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.studentProfileId !== studentProfile.id) {
    throw new Error('Unauthorized to delete this application')
  }

  // Prevent deletion if application is not in PENDING status
  if (application.status !== 'PENDING') {
    throw new Error('Cannot delete application that has been processed')
  }

  await prisma.jobApplication.delete({
    where: { id: applicationId }
  })

  return { success: true }
}
