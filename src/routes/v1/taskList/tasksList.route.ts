import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  createList,
  deleteList,
  getListById,
  getTaskLists,
  getTaskListsProtected,
  getTodosByListId,
  searchTasksList,
  updateList,
} from './taskLists.controller.js'
import type { AuthVariables } from '@/config/auth.js'
import protectLists from '@/middlewares/protectLists.middleware.js'
import protectRoutes from '@/middlewares/protectRoutes.middleware.js'
import { SearchQuerySchema } from '@/schemas/searchQuery.schemas.js'
import {
  createListSchema,
  filterTodosSchema,
  updateListSchema,
} from '@/schemas/taskList.schemas.js'

const tasksList = new Hono<{ Variables: AuthVariables }>()

// Scure the subtask routes
tasksList.use('*', protectRoutes)

// Protect the lists which is protected from modify the lists
tasksList.use('/:id/*', protectLists)

// GET

tasksList.get(
  '/search',
  zValidator('query', SearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid query format!', 400)
    }
  }),
  async c => {
    const queryParams = c.req.valid('query')
    return await searchTasksList(c, queryParams)
  },
)

tasksList.get('/', async c => {
  return await getTaskLists(c)
})

tasksList.get('/protected', async c => {
  return await getTaskListsProtected(c)
})

tasksList.get(
  '/:listId/todos',
  zValidator('query', filterTodosSchema, (result, c) => {
    if (!result.success) {
      return c.text(result.error.message, 400)
    }
  }),
  async c => {
    const { listId } = c.req.param()
    const queryParams = c.req.valid('query')
    return await getTodosByListId(c, listId, queryParams)
  },
)

tasksList.get('/:id', async c => {
  const { id } = c.req.param()
  return await getListById(c, id)
})

// POST

tasksList.post(
  '/',
  zValidator('json', createListSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid request body', 400)
    }
  }),
  async c => {
    const body = c.req.valid('json')
    return await createList(c, body)
  },
)

// PATCH

tasksList.patch(
  '/:id',
  zValidator('json', updateListSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid request body', 400)
    }
  }),
  async c => {
    const { id } = c.req.param()
    const body = c.req.valid('json')
    return await updateList(c, id, body)
  },
)

// DELETE

tasksList.delete('/:id', async c => {
  const { id } = c.req.param()
  return await deleteList(c, id)
})

export default tasksList
