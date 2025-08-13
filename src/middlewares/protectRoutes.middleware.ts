import type { Context, Next } from 'hono'
import { auth } from '@/config/auth.js'

async function protectRoutes(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session?.user) {
    return c.text('Not found', 401)
  }

  return next()
}

export default protectRoutes
