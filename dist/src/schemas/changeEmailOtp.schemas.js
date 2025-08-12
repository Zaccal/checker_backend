import z from "zod";
export const changeEmailOtpSchemas = z.object({
    oldEmail: z.string(),
    newEmail: z.email(),
});
