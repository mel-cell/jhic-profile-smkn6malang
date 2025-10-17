import type { Context, Next } from 'hono'

export async function logger(c: Context, next: Next) {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`)
  await next()
}
