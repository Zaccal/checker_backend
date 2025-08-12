import type { Hono } from "hono";
import type { Tag } from "../../../generated/prisma/index.js";

vi.mock("../../../lib/prisma.ts", async () => {
  const { mockPrisma } = await import("../../mock/prisma.mock.js");
  return mockPrisma;
});

vi.mock("../../../middlewares/protectRoutes.middleware.ts", async () => {
  const { mockSkipProtectedRoute } = await import(
    "../../mock/authMiddlewares.mock.js"
  );
  return mockSkipProtectedRoute;
});

vi.mock("../../../middlewares/getUser.middlleware.ts", async () => {
  const { mockGetUserMiddleware } = await import(
    "../../mock/authMiddlewares.mock.js"
  );
  return {
    default: mockGetUserMiddleware,
  };
});

let appIntance: Hono;
beforeAll(async () => {
  const { app } = await import("../../../app.js");
  appIntance = app;
});

describe("PATCH Method", () => {
  it("should update a tag", async () => {
    const res = await appIntance.request("/api/v1/tags/123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        name: "Updated Tag",
        color: "green",
      }),
    });
    const data = (await res.json()) as Tag;

    expect(res.status).toBe(200);
    expect(data.name).toBe("Tage");
  });
});
