import { Hono } from "hono";
import { Prisma } from "../../generated/prisma/index.js";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { PROFILE_SELECT } from "../../lib/constants.js";
import { getPrisma } from "../../lib/prisma.js";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";

const profileApp = new Hono<{
  Variables: AuthVariables;
}>();

profileApp.use("*", protectRoutes);

profileApp.get("/", async (c) => {
  const user = c.get("user");

  try {
    const profile = await getPrisma().user.findUnique({
      where: {
        id: user.id,
      },
      select: PROFILE_SELECT,
    });

    if (!profile) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(profile, 200);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(
        `An error occurred while getting the profile: ${error.message}`,
        500
      );
    }

    return c.text("An error occurred while getting the profile", 500);
  }
});

export default profileApp;
