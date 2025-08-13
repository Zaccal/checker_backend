import { describe, it, expect } from 'vitest'
import { app } from '@/app.js'
import type { Tag } from '@/generated/prisma/index.js'
import { expectedKeysTags, expectHasProperties } from '@/lib/testHelper.js'

describe('GET Method', () => {
  it('should return a list of tags', async () => {
    const res = await app.request('/api/v1/tags')
    const data = (await res.json()) as Tag[]

    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)

    if (Array.isArray(data)) {
      if (data.length) {
        const tag = data[0]
        expectHasProperties(tag, expectedKeysTags)
      }
    }
  })

  it('should return 404 for invalid endpoint', async () => {
    const res = await app.request('/api/v1/tagz')
    expect(res.status).toBe(404)
  })

  it('search by id, should return single tag', async () => {
    const res = await app.request('/api/v1/tags/cmc0dc0y80005pu0btanmt1fo')

    const data = (await res.json()) as Tag

    expect(res.status).toBe(200)
    expect(typeof data).toContain('object')

    expectHasProperties(data, expectedKeysTags)
  })

  it('search by query, should return multiple tags', async () => {
    const res = await app.request('/api/v1/tags/search?query=first', {
      headers: globalThis.authHeader,
      credentials: 'include',
    })
    const data = (await res.json()) as Tag[]

    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)

    if (Array.isArray(data)) {
      if (data.length) {
        const tag = data[0]
        expectHasProperties(tag, expectedKeysTags)
      }
    }
  })
})
