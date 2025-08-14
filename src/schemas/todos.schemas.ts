import { z } from 'zod'

export const todoCompletedSchema = z.object({
  complited: z.boolean(),
})

export const newTagSchema = z.object({
  name: z.string().min(2).max(50),
})

export const newSubtaskSchema = z.object({
  title: z.string().min(1).max(100),
  completed: z.boolean().optional().default(false),
})

export const tagInputSchema = z.union([z.string(), newTagSchema])

export type TagInputSchema = z.infer<typeof tagInputSchema>

export const subtaskInputSchema = newSubtaskSchema

export const todoCreateSchema = z.object({
  title: z.string().min(1).max(100),
  taskListId: z.string(),
  tags: z.array(tagInputSchema).optional(),
  expiresAt: z
    .string()
    .optional()
    .refine(value => !value || !isNaN(Date.parse(value)), {
      message: 'Invalid date string',
    }),
  subtasks: z.array(subtaskInputSchema).optional(),
})

export type TodoCreateSchema = z.infer<typeof todoCreateSchema>

export const todoUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  tags: z.array(tagInputSchema).optional(),
  expiresAt: z
    .string()
    .optional()
    .refine(value => !value || !isNaN(Date.parse(value)), {
      message: 'Invalid date string',
    }),
  subtasks: z.array(subtaskInputSchema).optional(),
})

export type TodoUpdateSchema = z.infer<typeof todoUpdateSchema>
