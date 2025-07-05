import { z } from "zod";

export const tagCreateSchema = z.object({
  name: z.string().min(2).max(50),
  color: z.string().min(2),
  todoId: z.string(),
});

export const tagUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  color: z.string().min(2).optional(),
});
