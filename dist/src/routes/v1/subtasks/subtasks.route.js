import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getTagById } from '../tags/tags.controller.js';
import { createSubtask, deleteSubtask, getSearchSubtasks, updateSubtask, } from './subtasks.controller.js';
import protectRoutes from '@/middlewares/protectRoutes.middleware.js';
import { SearchQuerySchema } from '@/schemas/searchQuery.schemas.js';
import { subtaskCreateSchema, subtaskUpdateSchema, } from '@/schemas/subtasks.schemas.js';
const subTaskApp = new Hono();
// Scure the subtask routes
subTaskApp.use('*', protectRoutes);
// GET
subTaskApp.get('/search', zValidator('query', SearchQuerySchema, (result, c) => {
    if (!result.success) {
        return c.text(result.error.message || 'Invalid query format!', 400);
    }
}), async (c) => {
    const queryParams = c.req.valid('query');
    return await getSearchSubtasks(c, queryParams);
});
subTaskApp.get('/:id', async (c) => {
    const { id } = c.req.param();
    return await getTagById(c, id);
});
// POST
subTaskApp.post('/', zValidator('json', subtaskCreateSchema, (result, c) => {
    if (!result.success) {
        return c.text('Invalide format!', 400);
    }
}), async (c) => {
    const body = c.req.valid('json');
    return await createSubtask(c, body);
});
// PATCH
subTaskApp.patch('/:id', zValidator('json', subtaskUpdateSchema, (result, c) => {
    if (!result.success) {
        return c.text('Invalide format!', 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    return await updateSubtask(c, body, id);
});
// DELETE
subTaskApp.delete('/:id', async (c) => {
    const { id } = c.req.param();
    return await deleteSubtask(c, id);
});
export default subTaskApp;
