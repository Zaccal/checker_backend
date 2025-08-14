import { z } from 'zod';
export const tagCreateSchema = z.object({
    name: z.string().min(2).max(50),
    todoId: z.string().optional(),
});
export const tagUpdateSchema = z.object({
    name: z.string().min(2).max(50).optional(),
});
