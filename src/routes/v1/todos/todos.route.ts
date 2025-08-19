import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  getSearch,
  getTodoById,
  createTodo,
  deleteTodo,
  completeTodo,
  updateTodo,
} from './todo.controller.js'
import type { AuthVariables } from '@/config/auth.js'
import protectRoutes from '@/middlewares/protectRoutes.middleware.js'
import { SearchQuerySchema } from '@/schemas/searchQuery.schemas.js'
import {
  todoCompletedSchema,
  todoCreateSchema,
  todoUpdateSchema,
} from '@/schemas/todos.schemas.js'

const todosApp = new Hono<{ Variables: AuthVariables }>()

// Secure the todos routes
todosApp.use('*', protectRoutes)

// GET

todosApp.get(
  '/search',
  zValidator('query', SearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid query format!', 400)
    }
  }),
  async c => {
    const query = c.req.valid('query')

    return await getSearch(c, query)
  },
)

todosApp.get('/:id', async c => {
  const { id } = c.req.param()

  return await getTodoById(c, id)
})

// POST

todosApp.post(
  '/',
  zValidator('json', todoCreateSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid Input', 400)
    }
  }),
  async c => {
    const body = c.req.valid('json')
    return await createTodo(c, body)
  },
)

// DELETE

todosApp.delete('/:id', async c => {
  const { id } = c.req.param()
  return await deleteTodo(c, id)
})

// PATCH

todosApp.patch(
  'completed/:id',
  zValidator('json', todoCompletedSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalide format!', 400)
    }
  }),
  async c => {
    const { id } = c.req.param()
    const { completed } = c.req.valid('json')
    return await completeTodo(c, id, completed)
  },
)

todosApp.patch(
  '/:id',
  zValidator('json', todoUpdateSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalide format!', 400)
    }
  }),
  async c => {
    const { id } = c.req.param()
    const body = c.req.valid('json')
    return await updateTodo(c, body, id)
  },
)

export default todosApp
