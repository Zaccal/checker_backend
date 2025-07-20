import { z } from "zod";

export const createListSchema = z.object({
  icon: z.string().nullable().optional().default(null),
  title: z.string().min(2).max(50),
});

export type CreateListDto = z.infer<typeof createListSchema>;

export const updateListSchema = z
  .object({
    icon: z.string().optional(),
    title: z.string().min(2).max(50).optional(),
  })
  .refine((data) => data.icon || data.title, {
    message: "At least one field must be provided for update",
    path: ["icon", "title"],
  });

export const filterTodosSchema = z.object({
  completed: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Must be 'true' or 'false' as a string",
    })
    .transform((val) => val === "true")
    .optional(),
  withDeadline: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Must be 'true' or 'false' as a string",
    })
    .transform((val) => val === "true")
    .optional(),
  onlyExpired: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Must be 'true' or 'false' as a string",
    })
    .transform((val) => val === "true")
    .optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  tagIds: z
    .string()
    .transform((val) => val.split(","))
    .optional(),
});

export type FilterTodosDto = z.infer<typeof filterTodosSchema>;
