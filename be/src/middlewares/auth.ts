import { MiddlewareHandler } from 'hono'
import { verify } from 'jsonwebtoken'
import prisma from '../config/database'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export interface AuthUser {
  userId: string
  email: string
  role: string
}

// JWT Authentication middleware
export const authenticate: MiddlewareHandler = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Authorization token required' }, 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 401)
    }

    // Add user to context
    c.set('user', user)

    await next()
  } catch (error) {
    console.error('Authentication error:', error)
    return c.json({ success: false, error: 'Invalid or expired token' }, 401)
  }
}

// Role-based authorization middleware
export const authorize = (...allowedRoles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user') as { role: string } | undefined

    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401)
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ success: false, error: 'Insufficient permissions' }, 403)
    }

    await next()
  }
}

// Specific role middlewares
export const requireStudent: MiddlewareHandler = authorize('STUDENT')
export const requireCompany: MiddlewareHandler = authorize('COMPANY')
export const requireAdmin: MiddlewareHandler = authorize('ADMIN')
export const requireStudentOrAdmin: MiddlewareHandler = authorize('STUDENT', 'ADMIN')
export const requireCompanyOrAdmin: MiddlewareHandler = authorize('COMPANY', 'ADMIN')
export const requireAnyAuthenticated: MiddlewareHandler = authorize('STUDENT', 'COMPANY', 'ADMIN')
