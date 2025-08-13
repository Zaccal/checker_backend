import { z } from "zod";

export const tagCreateSchema = z.object({
  name: z.string().min(2).max(50),
  todoId: z.string().optional(),
});

export type TagCreateSchemaDto = z.infer<typeof tagCreateSchema>;

export const tagUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
});

export type TagUpdateSchemaDto = z.infer<typeof tagUpdateSchema>;
