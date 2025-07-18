import { z } from "zod";
export const subtaskCreateSchema = z.object({
    title: z.string().min(1).max(100),
    taskId: z.string(),
});
export const subtaskUpdateSchema = z
    .object({
    title: z.string().optional(),
    completed: z.boolean().optional(),
})
    .refine((data) => data.title || data.completed, {
    message: "At least one field must be provided for update",
    path: ["title", "completed"],
});
