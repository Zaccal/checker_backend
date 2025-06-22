import { z } from "zod";

export const createListSchema = z.object({
  icon: z.string().min(2),
  title: z.string().min(2).max(50),
});

export type CreateListDto = z.infer<typeof createListSchema>;

export const updateListSchema = z
  .object({
    icon: z.string().min(2).optional(),
    title: z.string().min(2).max(50).optional(),
  })
  .refine((data) => data.icon || data.title, {
    message: "At least one field must be provided for update",
    path: ["icon", "title"],
  });
