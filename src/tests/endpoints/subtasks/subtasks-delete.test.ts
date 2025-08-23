import type { Hono } from 'hono'
import { Prisma } from '@/generated/prisma/index.js'

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
  const app = await import('../../../app.js')
  appInstance = app.default
})

describe('DELETE method', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('Delete subtask successfully', async () => {
    const response = await appInstance.request('/api/v1/subtasks/subtask-123', {
      method: 'DELETE',
      headers: globalThis.authHeader,
      credentials: 'include',
    })

    const data = (await response.json()) as {
      message: string
    }

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('message')
    expect(data.message).toBe('Subtask has deleted successfully')
  })

  test('Delete subtask with non-existent ID should return 404', async () => {
    // Mock the delete method to throw a P2025 error (record not found)
    const { mockPrisma } = await import('../../mock/prisma.mock.js')
    const mockSubTask = mockPrisma.getPrisma().subTask

    const mockError = new Prisma.PrismaClientKnownRequestError(
      'Record to delete does not exist.',
      {
        code: 'P2025',
        clientVersion: '6.0.0',
      },
    )

    // Create a mock error that will pass instanceof check
    mockSubTask.delete.mockRejectedValueOnce(mockError)

    const response = await appInstance.request(
      '/api/v1/subtasks/non-existent-id',
      {
        method: 'DELETE',
        headers: globalThis.authHeader,
        credentials: 'include',
      },
    )

    expect(response.status).toBe(404)
  })

  test('Delete subtask with database error should return 500', async () => {
    // Mock the delete method to throw a generic database error
    const { mockPrisma } = await import('../../mock/prisma.mock.js')
    const mockSubTask = mockPrisma.getPrisma().subTask
    mockSubTask.delete.mockRejectedValueOnce({
      code: 'P2000',
      message: 'Database connection error',
    })

    const response = await appInstance.request('/api/v1/subtasks/subtask-123', {
      method: 'DELETE',
      headers: globalThis.authHeader,
      credentials: 'include',
    })

    expect(response.status).toBe(500)
    const errorText = await response.text()
    expect(errorText).toContain('An error occurred while geting the subtask')
  })

  test('Delete subtask with generic error should return 500', async () => {
    // Mock the delete method to throw a generic error
    const { mockPrisma } = await import('../../mock/prisma.mock.js')
    const mockSubTask = mockPrisma.getPrisma().subTask
    mockSubTask.delete.mockRejectedValueOnce(new Error('Generic error'))

    const response = await appInstance.request('/api/v1/subtasks/subtask-123', {
      method: 'DELETE',
      headers: globalThis.authHeader,
      credentials: 'include',
    })

    expect(response.status).toBe(500)
    const errorText = await response.text()
    expect(errorText).toBe('An error occurred while geting the subtask')
  })
})
