import { Hono } from 'hono'
import { readFile } from 'fs/promises'
import { join } from 'path'
import exampleRouter from './routes/example'
import authRouter from './routes/auth'
import directRecruitmentRouter from './routes/directRecruitment'
import studentsRouter from './routes/students'
import companiesRouter from './routes/companies'
import jobsRouter from './routes/jobs'
import applicationsRouter from './routes/applications'
import adminRouter from './routes/admin'
import publicRouter from './routes/public'
import notificationsRouter from './routes/notifications'
import bookmarksRouter from './routes/bookmarks'
import reviewsRouter from './routes/reviews'
import interviewsRouter from './routes/interviews'
import portfoliosRouter from './routes/portfolios'
import messagesRouter from './routes/messages'
import settingsRouter from './routes/settings'
import activityLogsRouter from './routes/activityLogs'
import { logger } from './middlewares/logger'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use('*', logger)

// Serve static files from uploads directory
app.use('/uploads/*', async (c) => {
  const url = new URL(c.req.url)
  const isDownload = url.searchParams.get('download') === 'true'
  const path = c.req.path
  const filePath = path.replace('/uploads/', './uploads/')
  try {
    const file = await readFile(join(process.cwd(), filePath))
    // Determine content type based on file extension
    const ext = path.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === 'pdf') contentType = 'application/pdf'
    else if (ext === 'doc') contentType = 'application/msword'
    else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
    else if (ext === 'png') contentType = 'image/png'

    const fileName = path.split('/').pop() || 'file'
    const disposition = isDownload ? `attachment; filename="${fileName}"` : `inline; filename="${fileName}"`

    return c.body(new Uint8Array(file), 200, {
      'Content-Type': contentType,
      'Content-Disposition': disposition
    })
  } catch {
    return c.notFound()
  }
})

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'School Recruitment API is running',
    version: '1.0.0'
  })
})

// API routes
app.route('/auth', authRouter)
app.route('/direct-recruitments', directRecruitmentRouter)
app.route('/students', studentsRouter)
app.route('/companies', companiesRouter)
app.route('/jobs', jobsRouter)
app.route('/applications', applicationsRouter)
app.route('/admin', adminRouter)
app.route('/public', publicRouter)
app.route('/notifications', notificationsRouter)
app.route('/bookmarks', bookmarksRouter)
app.route('/reviews', reviewsRouter)
app.route('/interviews', interviewsRouter)
app.route('/portfolios', portfoliosRouter)
app.route('/messages', messagesRouter)
app.route('/settings', settingsRouter)
app.route('/activity-logs', activityLogsRouter)
app.route('/example', exampleRouter)

const port = parseInt(process.env.PORT!) || 3002
console.log(`Server is running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
