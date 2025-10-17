import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authenticate, authorize } from '../middlewares/auth'
import * as adminService from '../services/adminService'

const router = new Hono()

// User management
router.get('/users', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const users = await adminService.getAllUsers()
    return c.json({ success: true, data: users })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.put('/users/:userId/role', authenticate, authorize('ADMIN'), zValidator('json', z.object({
  role: z.enum(['STUDENT', 'COMPANY', 'ADMIN'])
})), async (c) => {
  try {
    const { userId } = c.req.param()
    const data = c.req.valid('json')

    const result = await adminService.updateUserRole(userId, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.delete('/users/:userId', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const { userId } = c.req.param()

    await adminService.deleteUser(userId)
    return c.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Job posting management
router.get('/jobs', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const jobs = await adminService.getAllJobPostings()
    return c.json({ success: true, data: jobs })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.put('/jobs/:jobId/status', authenticate, authorize('ADMIN'), zValidator('json', z.object({
  status: z.string().min(1)
})), async (c) => {
  try {
    const { jobId } = c.req.param()
    const { status } = c.req.valid('json')

    const result = await adminService.updateJobPostingStatus(jobId, status)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Application management
router.get('/applications', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const applications = await adminService.getAllApplications()
    return c.json({ success: true, data: applications })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Direct recruitment management
router.get('/direct-recruitments', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const recruitments = await adminService.getAllDirectRecruitments()
    return c.json({ success: true, data: recruitments })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

export default router
