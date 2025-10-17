import { Hono } from 'hono'

const router = new Hono()

router.get('/test', (c) => {
  return c.json({ message: 'Hello from example route' })
})

export default router
