import { Hono } from 'hono'
import { authenticate, authorize } from '../middlewares/auth'
import { createJob, getMyJobs, getJobById, updateJob, deleteJob, getJobApplications } from '../services/jobService'
import { z } from 'zod'

const app = new Hono()

// POST /jobs - Create a new job posting
app.post('/', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const user = c.get('user') as any
    const body = await c.req.json()

    const schema = z.object({
      jobTitle: z.string().min(1),
      description: z.string().optional(),
      requirements: z.string().optional(),
      location: z.string().optional(),
      salaryRange: z.string().optional(),
      employmentType: z.enum(['Full-time', 'Part-time', 'Internship']).optional().default('Full-time'),
      applicationDeadline: z.string().optional(),
      notes: z.string().optional()
    })

    const validatedData = schema.parse(body)

    const job = await createJob(user.id, validatedData)
    return c.json({ success: true, data: job }, 201)
  } catch (error: any) {
    console.error('Error creating job:', error)
    return c.json({ success: false, error: error.message || 'Failed to create job' }, 400)
  }
})

// GET /jobs/my - Get my job postings
app.get('/my', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const user = c.get('user') as any
    const jobs = await getMyJobs(user.id)
    return c.json({ success: true, data: jobs })
  } catch (error: any) {
    console.error('Error fetching my jobs:', error)
    return c.json({ success: false, error: error.message || 'Failed to fetch jobs' }, 400)
  }
})

// GET /jobs/:id - Get job by ID
app.get('/:id', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const jobId = c.req.param('id')
    const user = c.get('user') as any

    const job = await getJobById(jobId)

    if (!job) {
      return c.json({ success: false, error: 'Job not found' }, 404)
    }

    // Optional: Check if the job belongs to the user or is public
    // For now, return the job

    return c.json({ success: true, data: job })
  } catch (error: any) {
    console.error('Error fetching job:', error)
    return c.json({ success: false, error: error.message || 'Failed to fetch job' }, 400)
  }
})

// PUT /jobs/:id - Update job
app.put('/:id', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const jobId = c.req.param('id')
    const user = c.get('user') as any
    const body = await c.req.json()

    // Validate that the job belongs to the user
    const job = await getJobById(jobId)
    if (!job || job.companyProfile.userId !== user.id) {
      return c.json({ success: false, error: 'Unauthorized to update this job' }, 403)
    }

    const updatedJob = await updateJob(jobId, body)
    return c.json({ success: true, data: updatedJob })
  } catch (error: any) {
    console.error('Error updating job:', error)
    return c.json({ success: false, error: error.message || 'Failed to update job' }, 400)
  }
})

// DELETE /jobs/:id - Delete job
app.delete('/:id', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const jobId = c.req.param('id')
    const user = c.get('user') as any

    // Validate that the job belongs to the user
    const job = await getJobById(jobId)
    if (!job || job.companyProfile.userId !== user.id) {
      return c.json({ success: false, error: 'Unauthorized to delete this job' }, 403)
    }

    await deleteJob(jobId)
    return c.json({ success: true, message: 'Job deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting job:', error)
    return c.json({ success: false, error: error.message || 'Failed to delete job' }, 400)
  }
})

// GET /jobs/:id/applications - Get job applications
app.get('/:id/applications', authenticate, authorize('COMPANY'), async (c) => {
  try {
    const jobId = c.req.param('id')
    const user = c.get('user') as any

    // Validate that the job belongs to the user
    const job = await getJobById(jobId)
    if (!job || job.companyProfile.userId !== user.id) {
      return c.json({ success: false, error: 'Unauthorized to view applications' }, 403)
    }

    const applications = await getJobApplications(jobId)
    return c.json({ success: true, data: applications })
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    return c.json({ success: false, error: error.message || 'Failed to fetch applications' }, 400)
  }
})

export default app
