import prisma from '../config/database'

export interface UpdateUserRoleData {
  role: 'STUDENT' | 'COMPANY' | 'ADMIN'
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      studentProfile: true,
      companyProfile: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Transform data to match frontend expectations
  const transformedUsers = users.map(user => {
    const baseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    if (user.role === 'STUDENT' && user.studentProfile) {
      return {
        ...baseUser,
        name: user.studentProfile.fullName,
        nisn: user.studentProfile.nis,
        class: user.studentProfile.major,
        birthdate: user.studentProfile.birthDate,
        phone: user.studentProfile.phoneNumber,
        image: user.studentProfile.profilePhotoPath
      }
    } else if (user.role === 'COMPANY' && user.companyProfile) {
      return {
        ...baseUser,
        name: user.companyProfile.companyName,
        pic: user.companyProfile.contactPersonName,
        address: user.companyProfile.address,
        email: user.companyProfile.contactPersonEmail,
        field: user.companyProfile.industryType,
        logo: user.companyProfile.logoPath,
        status: 'AKTIF' // Default status, could be enhanced later
      }
    }

    return baseUser
  })

  return transformedUsers
}

export async function updateUserRole(userId: string, data: UpdateUserRoleData) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: data.role }
  })
}

export async function deleteUser(userId: string) {
  // Get user data
  const user: any = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Get related profiles
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      studentCvs: true,
      jobApplications: true,
      directRecruitmentsAsStudent: true
    }
  })

  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
    include: {
      jobPostings: {
        include: {
          jobApplications: true
        }
      },
      directRecruitments: true
    }
  })

  // Delete related data first
  if (studentProfile) {
    await prisma.studentCvs.deleteMany({
      where: { studentProfileId: studentProfile.id }
    })
    await prisma.jobApplication.deleteMany({
      where: { studentProfileId: studentProfile.id }
    })
    await prisma.directRecruitment.deleteMany({
      where: { studentProfileId: studentProfile.id }
    })
    await prisma.studentProfile.delete({
      where: { id: studentProfile.id }
    })
  }

  if (companyProfile) {
    await prisma.jobApplication.deleteMany({
      where: {
        jobPosting: {
          companyProfileId: companyProfile.id
        }
      }
    })
    await prisma.jobPosting.deleteMany({
      where: { companyProfileId: companyProfile.id }
    })
    await prisma.directRecruitment.deleteMany({
      where: { companyProfileId: companyProfile.id }
    })
    await prisma.companyProfile.delete({
      where: { id: companyProfile.id }
    })
  }

  await prisma.berita.deleteMany({
    where: { userId }
  })

  await prisma.ekskul.deleteMany({
    where: { userInternal: userId }
  })

  // Finally delete the user
  await prisma.user.delete({
    where: { id: userId }
  })

  return { success: true }
}

export async function getAllJobPostings() {
  return await prisma.jobPosting.findMany({
    include: {
      companyProfile: {
        select: {
          companyName: true,
          user: {
            select: {
              email: true
            }
          }
        }
      },
      jobApplications: {
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateJobPostingStatus(jobId: string, status: string) {
  return await prisma.jobPosting.update({
    where: { id: jobId },
    data: { status }
  })
}

export async function getAllApplications() {
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

export async function getAllDirectRecruitments() {
  return await prisma.directRecruitment.findMany({
    include: {
      companyProfile: {
        select: {
          companyName: true
        }
      },
      studentProfile: {
        select: {
          fullName: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }
    },
    orderBy: { recruitedAt: 'desc' }
  })
}
