import type { Hono } from 'hono'
import { handle } from 'hono/vercel'
// @ts-expect-error - Importing compiled JS file
import app from '../dist/src/app.js'

export const runtime = 'edge'

const honoApp = app as Hono

export const GET = handle(honoApp)
export const POST = handle(honoApp)
export const PUT = handle(honoApp)
export const PATCH = handle(honoApp)
export const DELETE = handle(honoApp)
export const HEAD = handle(honoApp)
export const OPTIONS = handle(honoApp)
