import { Hono } from 'hono'
import type { AuthType } from '../config/auth.js'
import { auth } from '../config/auth.js'

const authApp = new Hono<{ Bindings: AuthType }>({
  strict: true,
})

authApp.on(['POST', 'GET'], '/*', async c => {
  return auth.handler(c.req.raw)
})

export default authApp
