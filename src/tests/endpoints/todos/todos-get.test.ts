import app from '@/app.js'
import type { Todo } from '@/generated/prisma/index.js'
import { expectHasProperties, expectedKeysTodo } from '@/lib/testHelper.js'

describe('GET Method', () => {
  test('GET with id', async () => {
    const todos = await app.request('/api/v1/todos/cmb3mgkmw00043p0u6ajrjjxm', {
      method: 'GET',
      headers: globalThis.authHeader,
      credentials: 'include',
    })

    expect(todos.status).toBe(200)
    const todosData = (await todos.json()) as Todo[]
    expect(todosData).toBeDefined()
    expect(Array.isArray(todosData)).toBe(true)

    if (todosData.length > 0) {
      expectHasProperties(todosData[0], expectedKeysTodo)
    }
  })

  // ----------------------

  test('GET with invalid id', async () => {
    const todos = await app.request('/api/v1/todos/invalidListId', {
      method: 'GET',
      headers: globalThis.authHeader,
      credentials: 'include',
    })

    expect(todos.status).toBe(200)
    expect(await todos.json()).toEqual([])
  })

  // ----------------------

  test('GET search todos', async () => {
    const response = await app.request(
      '/api/v1/todos/search?query=It is first task',
      {
        method: 'GET',
        headers: globalThis.authHeader,
        credentials: 'include',
      },
    )
    const data = (await response.json()) as Todo[]

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)

    if (data.length > 0) {
      expectHasProperties(data[0], expectedKeysTodo)
    }
  })
})
