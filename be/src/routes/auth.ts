import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { authenticate } from '../middlewares/auth'
import {
  registerStudent,
  registerCompany,
  login,
  getProfile,
  updatePassword
} from '../services/authService'

const router = new Hono()

// Zod schemas for validation
const registerStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  major: z.string().optional(),
  description: z.string().optional(),
})

const registerCompanySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().min(1),
  industryType: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonEmail: z.string().email().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
})

// POST /auth/register/student - Register new student account
router.post('/register/student', zValidator('json', registerStudentSchema), async (c) => {
  try {
    const data = c.req.valid('json')
    const result = await registerStudent(data)
    return c.json({ success: true, data: result }, 201)
  } catch (error) {
    console.error('Student registration error:', error)
    if (error instanceof Error && error.message === 'Email already registered') {
      return c.json({ success: false, error: 'Email already registered' }, 409)
    }
    return c.json({ success: false, error: 'Registration failed' }, 500)
  }
})

// POST /auth/register/company - Register new company account
router.post('/register/company', zValidator('json', registerCompanySchema), async (c) => {
  try {
    const data = c.req.valid('json')
    const result = await registerCompany(data)
    return c.json({ success: true, data: result }, 201)
  } catch (error) {
    console.error('Company registration error:', error)
    if (error instanceof Error && error.message === 'Email already registered') {
      return c.json({ success: false, error: 'Email already registered' }, 409)
    }
    return c.json({ success: false, error: 'Registration failed' }, 500)
  }
})

// POST /auth/login - Login user
router.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const data = c.req.valid('json')
    const result = await login(data)
    return c.json({ success: true, data: result })
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }
    return c.json({ success: false, error: 'Login failed' }, 500)
  }
})

// GET /auth/me - Get current user profile (requires authentication)
router.get('/me', authenticate, async (c) => {
  try {
    const user = c.get('user')
    const profile = await getProfile(user.id)
    return c.json({ success: true, data: profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return c.json({ success: false, error: 'Failed to get profile' }, 500)
  }
})

// PUT /auth/password - Update user password (requires authentication)
router.put('/password', authenticate, zValidator('json', updatePasswordSchema), async (c) => {
  try {
    const user = c.get('user')
    const { currentPassword, newPassword } = c.req.valid('json')

    const result = await updatePassword(user.id, currentPassword, newPassword)
    return c.json({ success: true, data: result })
  } catch (error) {
    console.error('Update password error:', error)
    if (error instanceof Error && error.message === 'Current password is incorrect') {
      return c.json({ success: false, error: 'Current password is incorrect' }, 400)
    }
    if (error instanceof Error && error.message === 'User not found') {
      return c.json({ success: false, error: 'User not found' }, 404)
    }
    return c.json({ success: false, error: 'Failed to update password' }, 500)
  }
})

// POST /auth/register/admin - Register new admin account (temporary endpoint)
router.post('/register/admin', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1)
})), async (c) => {
  try {
    const data = c.req.valid('json')

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return c.json({ success: false, error: 'Email already registered' }, 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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

    return c.json({ success: true, data: { user, token } }, 201)
  } catch (error) {
    console.error('Admin registration error:', error)
    return c.json({ success: false, error: 'Registration failed' }, 500)
  }
})

export default router
