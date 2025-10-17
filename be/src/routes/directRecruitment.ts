import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import prisma from '../config/database'
import { getDirectRecruitments, createDirectRecruitment, updateDirectRecruitmentStatus } from '../services/directRecruitmentService'

const router = new Hono()

// Zod schemas for validation
const createDirectRecruitmentSchema = z.object({
  companyProfileId: z.string().uuid(),
  studentProfileId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  message: z.string().optional(),
  notes: z.string().optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']),
  notes: z.string().optional(),
})

// GET /direct-recruitments - Get all direct recruitments with optional filters
router.get('/', async (c) => {
  try {
    const { companyProfileId, studentProfileId, status, userId } = c.req.query()

    const filters: any = {}
    if (companyProfileId) filters.companyProfileId = companyProfileId
    if (studentProfileId) filters.studentProfileId = studentProfileId
    if (status) filters.status = status
    if (userId) filters.userId = userId

    const directRecruitments = await getDirectRecruitments(filters)
    return c.json({ success: true, data: directRecruitments })
  } catch (error) {
    console.error('Error fetching direct recruitments:', error)
    return c.json({ success: false, error: 'Failed to fetch direct recruitments' }, 500)
  }
})

// GET /direct-recruitments/:id - Get a specific direct recruitment by ID
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const directRecruitment = await prisma.directRecruitment.findUnique({
      where: { id },
      include: {
        companyProfile: {
          include: {
            user: true
          }
        },
        studentProfile: {
          include: {
            user: true
          }
        },
        recruiter: true
      }
    })

    if (!directRecruitment) {
      return c.json({ success: false, error: 'Direct recruitment not found' }, 404)
    }

    return c.json({ success: true, data: directRecruitment })
  } catch (error) {
    console.error('Error fetching direct recruitment:', error)
    return c.json({ success: false, error: 'Failed to fetch direct recruitment' }, 500)
  }
})

// POST /direct-recruitments - Create a new direct recruitment
router.post('/', zValidator('json', createDirectRecruitmentSchema), async (c) => {
  try {
    const data = c.req.valid('json')
    const directRecruitment = await createDirectRecruitment(data)
    return c.json({ success: true, data: directRecruitment }, 201)
  } catch (error) {
    console.error('Error creating direct recruitment:', error)
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return c.json({ success: false, error: 'Direct recruitment already exists for this company and student' }, 409)
    }
    return c.json({ success: false, error: 'Failed to create direct recruitment' }, 500)
  }
})

// PUT /direct-recruitments/:id/status - Update the status of a direct recruitment
router.put('/:id/status', zValidator('json', updateStatusSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const { status, notes } = c.req.valid('json')

    const updatedRecruitment = await updateDirectRecruitmentStatus(id, status, notes)
    return c.json({ success: true, data: updatedRecruitment })
  } catch (error) {
    console.error('Error updating direct recruitment status:', error)
    if (error instanceof Error && error.message === 'Direct recruitment not found') {
      return c.json({ success: false, error: 'Direct recruitment not found' }, 404)
    }
    return c.json({ success: false, error: 'Failed to update direct recruitment status' }, 500)
  }
})

// DELETE /direct-recruitments/:id - Delete a direct recruitment (soft delete by updating status)
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const updatedRecruitment = await prisma.directRecruitment.update({
      where: { id },
      data: { status: 'REJECTED' }
    })

    return c.json({ success: true, data: updatedRecruitment })
  } catch (error) {
    console.error('Error deleting direct recruitment:', error)
    return c.json({ success: false, error: 'Failed to delete direct recruitment' }, 500)
  }
})

export default router
