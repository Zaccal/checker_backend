import { z } from "zod";
export const SearchQuerySchema = z.object({
    query: z.string().min(1).max(100),
    limit: z.coerce
        .number()
        .min(1)
        .max(100)
        .transform(Number)
        .refine((value) => !isNaN(value), {
        message: "limit must be a valid number",
    })
        .optional(),
    offset: z.coerce
        .number()
        .min(0)
        .transform(Number)
        .refine((value) => !isNaN(value), {
        message: "offset must be a valid number",
    })
        .optional(),
});
