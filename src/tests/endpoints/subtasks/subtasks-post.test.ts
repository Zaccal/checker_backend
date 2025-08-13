import type { Hono } from 'hono'
import type { SubTask } from '@/generated/prisma/index.js'
import { expectedKeysSubtask, expectHasProperties } from '@/lib/testHelper.js'
import type { SubtaskCreateSchema } from '@/schemas/subtasks.schemas.js'

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

  test('Create a subtask', async () => {
    const response = await appInstance.request('api/v1/subtasks', {
      method: 'POST',
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: 'Test Subtask',
        taskId: 'test-task-id',
      } satisfies SubtaskCreateSchema),
      credentials: 'include',
    })

    const data = (await response.json()) as SubTask

    expect(response.status).toBe(200)
    expectHasProperties(data, expectedKeysSubtask)
  })

  test('Create a subtask with empty title should fail', async () => {
    const response = await appInstance.request('/api/v1/subtasks', {
      method: 'POST',
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: '',
        taskId: 'test-task-id',
      }),
      credentials: 'include',
    })

    expect(response.status).toBe(400)
  })

  test('Create a subtask with missing taskId should fail', async () => {
    const response = await appInstance.request('/api/v1/subtasks', {
      method: 'POST',
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: 'Test Subtask',
      }),
      credentials: 'include',
    })

    expect(response.status).toBe(400)
  })

  test('Create a subtask with title too long should fail', async () => {
    const longTitle = 'a'.repeat(101) // 101 characters, exceeding max of 100
    const response = await appInstance.request('/api/v1/subtasks', {
      method: 'POST',
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: longTitle,
        taskId: 'test-task-id',
      }),
      credentials: 'include',
    })

    expect(response.status).toBe(400)
  })
})
