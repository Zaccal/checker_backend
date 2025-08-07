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

  test("POST create a todo task with new tags and subtasks", async () => {
    const response = await appInstance.request("/api/v1/todos", {
      method: "POST",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Test Todo with Tags and Subtasks",
        taskListId: "12o3i139129",
        tags: ["existing-tag-id", { name: "New Tag 1" }, { name: "New Tag 2" }],
        subTasks: [{ title: "Subtask 1" }, { title: "Subtask 2" }],
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test Todo");
    expect(data.completed).toBe(false);
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.expiresAt).toBeDefined();
    expect(data.subTasks).toHaveLength(2);
    expect(data.tags).toHaveLength(3);
  });

  test("POST create a todo task with only new tags", async () => {
    const response = await appInstance.request("/api/v1/todos", {
      method: "POST",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Test Todo with New Tags Only",
        taskListId: "12o3i139129",
        tags: [{ name: "Brand New Tag" }],
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test Todo with New Tags Only");
    expect(data.subTasks).toHaveLength(0);
    expect(data.tags).toHaveLength(1);
  });

  test("POST create a todo task with only new subtasks", async () => {
    const response = await appInstance.request("/api/v1/todos", {
      method: "POST",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Test Todo with New Subtasks Only",
        taskListId: "12o3i139129",
        subTasks: [{ title: "Only Subtask" }],
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test Todo with New Subtasks Only");
    expect(data.subTasks).toHaveLength(1);
    expect(data.tags).toHaveLength(0);
  });
});
