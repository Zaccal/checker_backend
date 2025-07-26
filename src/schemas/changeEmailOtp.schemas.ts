import z from "zod";

export const changeEmailOtpSchemas = z.object({
  oldEmail: z.string(),
  newEmail: z.string().email(),
});

export type ChangeEmailOtpSchemas = z.infer<typeof changeEmailOtpSchemas>;
