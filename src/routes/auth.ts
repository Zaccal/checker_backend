import { Hono } from "hono";
import { auth, type AuthType } from "../lib/auth-instance.js";

const authApp = new Hono<{ Bindings: AuthType }>({
  strict: true,
});

authApp.on(["POST", "GET"], "/*", async (c) => {
  return auth.handler(c.req.raw);
});

export default authApp;
