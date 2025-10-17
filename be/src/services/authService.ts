import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'

export interface RegisterStudentData {
  email: string
  password: string
  fullName: string
  address?: string
  phoneNumber?: string
  major?: string
  description?: string
}

export interface RegisterCompanyData {
  email: string
  password: string
  companyName: string
  industryType?: string
  address?: string
  phoneNumber?: string
  website?: string
  description?: string
  contactPersonName?: string
  contactPersonEmail?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
  }
  token: string
  profile?: any
}

export async function registerStudent(data: RegisterStudentData): Promise<AuthResponse> {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create user and student profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'STUDENT'
      }
    })

    const studentProfile = await tx.studentProfile.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        major: data.major,
        description: data.description
      }
    })

    return { user, studentProfile }
  })

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role
    },
    token,
    profile: result.studentProfile
  }
}

export async function registerCompany(data: RegisterCompanyData): Promise<AuthResponse> {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create user and company profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'COMPANY'
      }
    })

    const companyProfile = await tx.companyProfile.create({
      data: {
        userId: user.id,
        companyName: data.companyName,
        industryType: data.industryType,
        address: data.address,
        phoneNumber: data.phoneNumber,
        website: data.website,
        description: data.description,
        contactPersonName: data.contactPersonName,
        contactPersonEmail: data.contactPersonEmail
      }
    })

    return { user, companyProfile }
  })

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role
    },
    token,
    profile: result.companyProfile
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(data.password, user.password)
  if (!isValidPassword) {
    throw new Error('Invalid email or password')
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  // Get profile based on role
  let profile = null
  if (user.role === 'STUDENT') {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    })
  } else if (user.role === 'COMPANY') {
    profile = await prisma.companyProfile.findUnique({
      where: { userId: user.id }
    })
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    },
    token,
    profile
  }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  let profile = null
  if (user.role === 'STUDENT') {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: userId }
    })
  } else if (user.role === 'COMPANY') {
    profile = await prisma.companyProfile.findUnique({
      where: { userId: userId }
    })
  }

  return {
    user,
    profile
  }
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password)
  if (!isValidPassword) {
    throw new Error('Current password is incorrect')
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  })

  return { success: true, message: 'Password updated successfully' }
}
