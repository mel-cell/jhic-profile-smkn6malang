import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authenticate, authorize } from '../middlewares/auth'
import * as companyService from '../services/companyService'

const router = new Hono()

// Get company profile (for authenticated company)
router.get('/profile', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const user = c.get('user') as any
    const result = await companyService.getCompanyProfile(user.id)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Update company profile
router.put('/profile', authenticate, authorize('COMPANY'), zValidator('json', z.object({
  companyName: z.string().min(1),
  industryType: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  contactPersonPhotoPath: z.string().optional()
})), async (c) => {
  try {
    const user = c.get('user') as any
    const data = c.req.valid('json')

    const result = await companyService.updateCompanyProfile(user.id, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Upload company logo
router.post('/logo', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const user = c.get('user') as any
    const formData = await c.req.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return c.json({ success: false, error: 'Logo file is required' }, 400)
    }

    const result = await companyService.uploadCompanyLogo(user.id, file)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get all companies (public access for visitors)
router.get('/', async (c) => {
  try {
    const companies = await companyService.getAllCompanies()
    return c.json({ success: true, data: companies })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get company detail
router.get('/:userId', authenticate, authorize('ADMIN', 'STUDENT', 'COMPANY'), async (c) => {
  try {
    const { userId } = c.req.param()
    const company = await companyService.getCompanyDetail(userId)
    return c.json({ success: true, data: company })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

export default router
