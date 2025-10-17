import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authenticate, authorize } from '../middlewares/auth'
import * as applicationService from '../services/applicationService'

const router = new Hono()

// Apply for a job
router.post('/jobs/:jobId/apply', authenticate, authorize('STUDENT'), zValidator('json', z.object({
  studentCvId: z.string().min(1),
  notes: z.string().optional()
})), async (c) => {
  try {
    const user = c.get('user') as any
    const { jobId } = c.req.param()
    const data = c.req.valid('json')

    const result = await applicationService.applyForJob(user.id, jobId, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get my applications (for students)
router.get('/', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const applications = await applicationService.getMyApplications(user.id)
    return c.json({ success: true, data: applications })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Update application status (for companies and admins)
router.put('/:applicationId', authenticate, authorize('COMPANY', 'ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { applicationId } = c.req.param()
    const { status } = await c.req.json()

    if (!status) {
      return c.json({ success: false, error: 'Status is required' }, 400)
    }

    const result = await applicationService.updateApplicationStatus(applicationId, status, user.id, user.role === 'ADMIN')
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Delete application (for students who applied)
router.delete('/:applicationId', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const { applicationId } = c.req.param()

    const result = await applicationService.deleteApplication(applicationId, user.id)
    return c.json({ success: true, message: 'Application deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get all applications (admin only)
router.get('/admin/all', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const applications = await applicationService.getAllApplications(true)
    return c.json({ success: true, data: applications })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

export default router
