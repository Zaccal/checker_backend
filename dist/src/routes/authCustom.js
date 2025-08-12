import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Prisma } from "../generated/prisma/index.js";
import { getPrisma } from "../lib/prisma.js";
import { changeEmailOtpSchemas } from "../schemas/changeEmailOtp.schemas.js";
const authCustom = new Hono({
    strict: true,
});
authCustom.post("/email-otp/change-email", zValidator("json", changeEmailOtpSchemas, (result, c) => {
    if (!result.success) {
        return c.text("Invalid format!", 400);
    }
}), async (c) => {
    const { newEmail, oldEmail } = c.req.valid("json");
    try {
        await getPrisma().user.update({
            where: {
                email: oldEmail,
                emailVerified: false,
            },
            data: {
                email: newEmail,
            },
        });
        return c.json({
            success: true,
        });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("User not found.", 404);
            }
            return c.text("An error occurred while changing email (prisma).", 500);
        }
        return c.text("An error occurred while changing email.", 500);
    }
});
export default authCustom;
