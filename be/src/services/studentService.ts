import prisma from "../config/database";

export interface UpdateStudentProfileData {
  fullName?: string;
  nis?: string;
  address?: string;
  phoneNumber?: string;
  major?: string;
  description?: string;
  profilePhotoPath?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  skills?: string;
}

export interface StudentProfileData {
  fullName: string;
  nis?: string | null;
  major?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  description?: string | null;
  profilePhotoPath?: string | null;
  email: string;
  gender?: string | null;
  birthDate?: string | null;
  skills?: string | null;
  role: string;
  createdAt: Date;
}

export interface UploadCvData {
  title?: string;
  description?: string;
}

export async function updateStudentProfile(
  userId: string,
  data: UpdateStudentProfileData
) {
  console.log(
    "updateStudentProfile called with userId:",
    userId,
    "data:",
    data
  );

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!studentProfile) {
    console.error("Student profile not found for userId:", userId);
    throw new Error("Student profile not found");
  }

  // Separate user and profile data
  const { email, ...profileData } = data;
  console.log("Updating profile data:", profileData);

  // Update user table if email is provided
  if (email) {
    console.log("Updating user email:", email);
    await prisma.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  // Update student profile
  const result = await prisma.studentProfile.update({
    where: { userId },
    data: profileData,
  });

  console.log("Profile updated successfully:", result);
  return result;
}

export async function getStudentCvs(userId: string) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  return await prisma.studentCvs.findMany({
    where: { studentProfileId: studentProfile.id },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function uploadCv(
  userId: string,
  file: File,
  metadata: UploadCvData
) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  // In a real implementation, you would upload the file to a storage service
  // For now, we'll just store the filename
  const fileName = `${Date.now()}-${file.name || "cv.pdf"}`;
  const filePath = `/uploads/cvs/${fileName}`;

  // Save file to disk
  const fs = require("fs").promises;
  const path = require("path");

  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "uploads", "cvs");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file
    const fileBuffer = await file.arrayBuffer();
    const fileFullPath = path.join(uploadsDir, fileName);
    await fs.writeFile(fileFullPath, Buffer.from(fileBuffer));

    return await prisma.studentCvs.create({
      data: {
        studentProfileId: studentProfile.id,
        fileName: fileName,
        filePath,
        fileSize: file.size || 1024,
      },
    });
  } catch (error) {
    console.error("Error saving CV file:", error);
    throw new Error("Failed to save CV file");
  }
}

export async function deleteCv(
  userId: string,
  cvId: string,
  isAdmin: boolean = false
) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  const cv = await prisma.studentCvs.findUnique({
    where: { id: cvId },
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  if (!isAdmin && cv.studentProfileId !== studentProfile.id) {
    throw new Error("Unauthorized to delete this CV");
  }

  // Delete file from disk
  const fs = require("fs").promises;
  const path = require("path");

  try {
    const filePath = path.join(process.cwd(), cv.filePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.warn("Error deleting CV file from disk:", error);
    // Continue with database deletion even if file deletion fails
  }

  await prisma.studentCvs.delete({
    where: { id: cvId },
  });

  return { success: true };
}

export async function getAllStudents() {
  return await prisma.studentProfile.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true,
        },
      },
      studentCvs: {
        select: {
          id: true,
          fileName: true,
          uploadedAt: true,
        },
      },
    },
  });
}

export async function uploadProfilePhoto(userId: string, file: File) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  // In a real implementation, you would upload the file to a storage service
  // For now, we'll just store the filename
  const fileName = `${Date.now()}-${file.name || "profile.jpg"}`;
  const filePath = `/uploads/profile-photos/${fileName}`;

  // Save file to disk
  const fs = require("fs").promises;
  const path = require("path");

  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "uploads", "profile-photos");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file
    const fileBuffer = await file.arrayBuffer();
    const fileFullPath = path.join(uploadsDir, fileName);
    await fs.writeFile(fileFullPath, Buffer.from(fileBuffer));

    return await prisma.studentProfile.update({
      where: { userId },
      data: { profilePhotoPath: filePath },
    });
  } catch (error) {
    console.error("Error saving profile photo file:", error);
    throw new Error("Failed to save profile photo file");
  }
}

export async function getStudentDetail(
  userId: string
): Promise<StudentProfileData> {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true,
        },
      },
      studentCvs: true,
      jobApplications: {
        include: {
          jobPosting: {
            select: {
              jobTitle: true,
              companyProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Return combined data from User and StudentProfile tables
  return {
    fullName: student.fullName,
    nis: student.nis,
    major: student.major,
    address: student.address,
    phoneNumber: student.phoneNumber,
    description: student.description,
    profilePhotoPath: student.profilePhotoPath,
    email: student.user.email,
    gender: student.gender,
    birthDate: student.birthDate,
    skills: student.skills,
    role: student.user.role,
    createdAt: student.user.createdAt,
  };
}

export async function getStudentsForCompanies(search?: string, major?: string) {
  const where: any = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (major) {
    where.major = { contains: major, mode: 'insensitive' };
  }

  return await prisma.studentProfile.findMany({
    where,
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true,
        },
      },
      studentCvs: {
        select: {
          id: true,
          fileName: true,
          uploadedAt: true,
        },
        orderBy: { uploadedAt: 'desc' },
        take: 1, // Get latest CV
      },
    },
    orderBy: { fullName: 'asc' },
  });
}
