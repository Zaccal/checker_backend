import type { Hono } from "hono";

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

let appInstance: Hono;
beforeAll(async () => {
  const { app } = await import("../../../app.js");
  appInstance = app;
});

describe("POST method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("POST create a todo task", async () => {
    const response = await appInstance.request("/api/v1/todos", {
      method: "POST",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Test Todo",
        taskListId: "12o3i139129",
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: "12345",
      title: "Test Todo",
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      expiresAt: expect.any(String),
      subTasks: [],
      tags: [],
    });
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test Todo");
    expect(data.completed).toBe(false);
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.expiresAt).toBeDefined();
    expect(data.subTasks).toEqual([]);
    expect(data.tags).toEqual([]);
  });
});
