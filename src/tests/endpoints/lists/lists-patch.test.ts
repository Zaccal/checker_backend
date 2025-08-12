import type { Hono } from "hono";
import type { TodoList } from "@/generated/prisma/index.js";

vi.mock("../../../lib/prisma.js", async () => {
  const { mockPrisma } = await import("../../mock/prisma.mock.js");
  return mockPrisma;
});

vi.mock("../../../middlewares/protectRoutes.middleware.js", async () => {
  const { mockSkipProtectedRoute } = await import(
    "../../mock/authMiddlewares.mock.js"
  );
  return mockSkipProtectedRoute;
});

vi.mock("../../../middlewares/getUser.middlleware.js", async () => {
  const { mockGetUserMiddleware } = await import(
    "../../mock/authMiddlewares.mock.js"
  );
  return {
    default: mockGetUserMiddleware,
  };
});

let appInstance: Hono;
beforeAll(async () => {
  const { app } = await import("../../../app.js");
  appInstance = app;
});

describe("PATCH Mathod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should update a list", async () => {
    const response = await appInstance.request("/api/v1/lists/123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Updated Title",
        icon: "Updated Icon",
      }),
    });

    const data = (await response.json()) as TodoList;

    expect(response.status).toBe(200);
    expect(data).toBeDefined();
    expect(data.title).toBe("Inbox");
    expect(data.icon).toBe("Inbox");
  });

  test("should add a task to a list", async () => {
    const response = await appInstance.request("/api/v1/lists/123/456", {
      method: "PATCH",
      headers: global.authHeader,
    });

    const data = (await response.json()) as TodoList;

    expect(response.status).toBe(201);
    expect(data).toEqual({ success: true });
  });
});
