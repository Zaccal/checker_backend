import { z } from "zod";
export const createListSchema = z.object({
    icon: z.string().nullable().optional().default(null),
    title: z.string().min(2).max(50),
});
export const updateListSchema = z
    .object({
    icon: z.string().optional(),
    title: z.string().min(2).max(50).optional(),
})
    .refine((data) => data.icon || data.title, {
    message: "At least one field must be provided for update",
    path: ["icon", "title"],
});
