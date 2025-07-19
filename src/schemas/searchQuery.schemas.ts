import { z } from "zod";

export const SearchQuerySchema = z
  .object({
    query: z
      .string()
      .max(100, "Query must be less than 100 characters")
      .optional()
      .default(""),
    limit: z.coerce
      .number()
      .min(1, "Limit must be greater than 0")
      .transform(Number)
      .refine((value) => !isNaN(value), {
        message: "'limit' must be a valid number",
      })
      .optional(),
    offset: z.coerce
      .number()
      .min(0)
      .transform(Number)
      .refine((value) => !isNaN(value), {
        message: "'offset' must be a valid number",
      })
      .optional(),
  })
  .strict("Invalid query format!");

export type SearchQueryDto = z.infer<typeof SearchQuerySchema>;
