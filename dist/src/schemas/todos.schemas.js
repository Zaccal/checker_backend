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
    tags: z.array(z.string()).optional(),
    expiresAt: z
        .string()
        .optional()
        .refine((value) => value && !isNaN(Date.parse(value)), {
        message: "Invalid date string",
    }),
    subTasks: z.array(z.string()).optional(),
});
