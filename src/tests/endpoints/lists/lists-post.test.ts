import type { Hono } from 'hono'
import type { TodoList } from '@/generated/prisma/index.js'
import { expectedKeysLists, expectHasProperties } from '@/lib/testHelper.js'
import type { CreateListDto } from '@/schemas/taskList.schemas.js'

vi.mock('../../../lib/prisma.ts', async () => {
  const { mockPrisma } = await import('../../mock/prisma.mock.js')
  return mockPrisma
})

vi.mock('../../../middlewares/protectRoutes.middleware.ts', async () => {
  const { mockSkipProtectedRoute } = await import(
    '../../mock/authMiddlewares.mock.js'
  )
  return mockSkipProtectedRoute
})

vi.mock('../../../middlewares/getUser.middlleware.ts', async () => {
  const { mockGetUserMiddleware } = await import(
    '../../mock/authMiddlewares.mock.js'
  )
  return {
    default: mockGetUserMiddleware,
  }
})

let appInstance: Hono
beforeAll(async () => {
  const { app } = await import('../../../app.js')
  appInstance = app
})

describe('POST method', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  test('Create a list', async () => {
    const resposne = await appInstance.request('/api/v1/lists', {
      method: 'POST',
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: 'Test',
        icon: 'Test',
      } satisfies CreateListDto),
      credentials: 'include',
    })

    const data = (await resposne.json()) as TodoList

    expect(resposne.status).toBe(200)

    expectHasProperties(data, expectedKeysLists)
  })
})
