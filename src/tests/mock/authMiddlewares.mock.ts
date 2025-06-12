import type { Context, Next } from "hono";

export const mockGetUserMiddleware = (c: Context, next: Next) => {
  c.set("user", {
    id: "111",
  });

  c.set("session", {
    userId: "111",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day later
  });

  return next();
};

export const mockSkipProtectedRoute = {
  default: async (_: Context, next: Next) => {
    return next();
  },
};
