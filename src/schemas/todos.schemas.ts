import { z } from "zod";

export const todoCompletedSchema = z.object({
  complited: z.boolean(),
});

export const todoUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  expiresAt: z.date().optional(),
});

export const todoCreateSchema = z.object({
  title: z.string().min(1).max(100),
  taskListId: z.string(),
});
