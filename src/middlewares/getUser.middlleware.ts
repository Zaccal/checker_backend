import type { Context, Next } from "hono";
import { auth } from "@/config/auth.js";

async function userMidllware(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (session) {
    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  }

  c.text("Couldn't get session");
}

export default userMidllware;
