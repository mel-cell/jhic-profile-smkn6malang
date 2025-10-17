import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authenticate, authorize } from '../middlewares/auth'
import * as publicService from '../services/publicService'

declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string
      email: string
      role: string
    }
  }
}

const router = new Hono()

// News endpoints
router.get('/news', async (c) => {
  try {
    const news = await publicService.getAllNews()
    return c.json({ success: true, data: news })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.get('/news/:newsId', async (c) => {
  try {
    const { newsId } = c.req.param()
    const news = await publicService.getNewsDetail(newsId)
    return c.json({ success: true, data: news })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Extracurricular endpoints
router.get('/extracurriculars', async (c) => {
  try {
    const extracurriculars = await publicService.getAllExtracurriculars()
    return c.json({ success: true, data: extracurriculars })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.get('/extracurriculars/:ekskulId', async (c) => {
  try {
    const { ekskulId } = c.req.param()
    const ekskul = await publicService.getExtracurricularDetail(ekskulId)
    return c.json({ success: true, data: ekskul })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Admin news management
router.post('/admin/news', authenticate, authorize('ADMIN'), zValidator('json', z.object({
  judul: z.string().min(1),
  content: z.string().min(1),
  imagePath: z.string().optional(),
  kategori: z.string().optional()
})), async (c) => {
  try {
    const user = c.get('user') as any
    const data = c.req.valid('json')

    const result = await publicService.createNews(user.id, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.put('/admin/news/:newsId', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { newsId } = c.req.param()
    const data = await c.req.json()

    const result = await publicService.updateNews(newsId, user.id, data, true)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.delete('/admin/news/:newsId', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { newsId } = c.req.param()

    await publicService.deleteNews(newsId, user.id, true)
    return c.json({ success: true, message: 'News deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Jobs endpoints (public access to approved jobs)
router.get('/jobs', async (c) => {
  try {
    const jobs = await publicService.getAllJobs()
    return c.json({ success: true, data: jobs })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.get('/jobs/:jobId', async (c) => {
  try {
    const { jobId } = c.req.param()
    const job = await publicService.getJobDetail(jobId)
    return c.json({ success: true, data: job })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.get('/jobs/:jobId/similar', async (c) => {
  try {
    const { jobId } = c.req.param()
    const limit = parseInt(c.req.query('limit') || '5')
    const similarJobs = await publicService.getSimilarJobs(jobId, limit)
    return c.json({ success: true, data: similarJobs })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Admin extracurricular management
router.post('/admin/extracurriculars', authenticate, authorize('ADMIN'), zValidator('json', z.object({
  namaEkskul: z.string().min(1),
  deskripsi: z.string().optional(),
  kategori: z.string().optional(),
  status: z.string().optional()
})), async (c) => {
  try {
    const user = c.get('user') as any
    const data = c.req.valid('json')

    const result = await publicService.createExtracurricular(user.id, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.put('/admin/extracurriculars/:ekskulId', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { ekskulId } = c.req.param()
    const data = await c.req.json()

    const result = await publicService.updateExtracurricular(ekskulId, user.id, data, true)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

router.delete('/admin/extracurriculars/:ekskulId', authenticate, authorize('ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { ekskulId } = c.req.param()

    await publicService.deleteExtracurricular(ekskulId, user.id, true)
    return c.json({ success: true, message: 'Extracurricular deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

export default router
