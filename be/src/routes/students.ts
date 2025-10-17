import { Hono } from 'hono'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authenticate, authorize } from '../middlewares/auth'
import * as studentService from '../services/studentService'
import prisma from '../config/database'

const router = new Hono()

// Get student profile
router.get('/profile', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const student = await studentService.getStudentDetail(user.id)
    return c.json({ success: true, data: student })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Update student profile
router.put('/profile', authenticate, authorize('STUDENT'), zValidator('json', z.object({
  fullName: z.string().optional(),
  nis: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  major: z.string().optional(),
  description: z.string().optional(),
  profilePhotoPath: z.string().optional(),
  email: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  skills: z.string().optional()
})), async (c) => {
  try {
    const user = c.get('user') as any
    const data = c.req.valid('json')

    const result = await studentService.updateStudentProfile(user.id, data)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get student's CVs
router.get('/cvs', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const cvs = await studentService.getStudentCvs(user.id)
    return c.json({ success: true, data: cvs })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Upload CV
router.post('/cvs', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const formData = await c.req.formData()
    const file = formData.get('cv') as File
    const metadata = JSON.parse(formData.get('metadata') as string || '{}')

    if (!file) {
      return c.json({ success: false, error: 'CV file is required' }, 400)
    }

    const result = await studentService.uploadCv(user.id, file, metadata)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Upload profile photo
router.post('/profile/photo', authenticate, authorize('STUDENT'), async (c) => {
  try {
    const user = c.get('user') as any
    const formData = await c.req.formData()
    const file = formData.get('photo') as File

    if (!file) {
      return c.json({ success: false, error: 'Photo file is required' }, 400)
    }

    const result = await studentService.uploadProfilePhoto(user.id, file)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Delete CV
router.delete('/cvs/:cvId', authenticate, authorize('STUDENT', 'ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { cvId } = c.req.param()

    await studentService.deleteCv(user.id, cvId, user.role === 'ADMIN')
    return c.json({ success: true, message: 'CV deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Serve CV file
router.get('/cv/:filename', authenticate, authorize('STUDENT', 'COMPANY', 'ADMIN'), async (c) => {
  try {
    const user = c.get('user') as any
    const { filename } = c.req.param()
    const isDownload = c.req.query('download') === 'true'

    let cv;

    if (user.role === 'STUDENT') {
      // Verify the CV belongs to the authenticated student
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });

      if (!studentProfile) {
        return c.json({ success: false, error: 'Student profile not found' }, 404)
      }

      cv = await prisma.studentCvs.findFirst({
        where: {
          studentProfileId: studentProfile.id,
          fileName: filename,
        },
      });
    } else {
      // For COMPANY and ADMIN, allow viewing any CV
      cv = await prisma.studentCvs.findFirst({
        where: {
          fileName: filename,
        },
      });
    }

    if (!cv) {
      return c.json({ success: false, error: 'CV not found or access denied' }, 404)
    }

    // Serve the file
    const filePath = join(process.cwd(), cv.filePath.replace('/uploads/', './uploads/'))
    const file = await readFile(filePath)

    // Determine content type
    const ext = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === 'pdf') contentType = 'application/pdf'
    else if (ext === 'doc') contentType = 'application/msword'
    else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    const disposition = isDownload ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`

    return c.body(new Uint8Array(file), 200, {
      'Content-Type': contentType,
      'Content-Disposition': disposition
    })
  } catch (error: any) {
    console.error('Error serving CV file:', error)
    return c.json({ success: false, error: 'Failed to serve file' }, 500)
  }
})

// Get all students (for companies, students, and admins)
router.get('/', authenticate, authorize('ADMIN', 'COMPANY', 'STUDENT'), async (c) => {
  try {
    const search = c.req.query('search')
    const major = c.req.query('major')
    const students = await studentService.getStudentsForCompanies(search, major)
    return c.json({ success: true, data: students })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

// Get student detail
router.get('/:userId', authenticate, authorize('ADMIN', 'COMPANY', 'STUDENT'), async (c) => {
  try {
    const { userId } = c.req.param()
    const student = await studentService.getStudentDetail(userId)
    return c.json({ success: true, data: student })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
})

export default router
