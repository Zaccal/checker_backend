import type { OpenAPIObjectConfigure } from '@hono/zod-openapi'
import type { Env } from 'hono'

export const documentation: OpenAPIObjectConfigure<Env, '/doc'> = {
  openapi: '3.0.0',
  info: {
    title: 'API documentation',
    version: '0.0.1',
    description: "This is checker's api documentation",
  },
}
