import type { Hono } from "hono";
import {
  expectedKeysSubtask,
  expectHasProperties,
} from "../../../lib/testHelper.js";
import type { subtaskUpdateSchema } from "../../../schemas/subtasks.schemas.js";

type UpdateSubtaskDto = typeof subtaskUpdateSchema._type;

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

describe("PATCH method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Update subtask title", async () => {
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Updated Subtask Title",
      } satisfies UpdateSubtaskDto),
      credentials: "include",
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expectHasProperties(data, expectedKeysSubtask);
  });

  test("Update subtask completed status", async () => {
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        completed: true,
      } satisfies UpdateSubtaskDto),
      credentials: "include",
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expectHasProperties(data, expectedKeysSubtask);
  });

  test("Update subtask title and completed status", async () => {
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: "Updated Subtask Title",
        completed: true,
      } satisfies UpdateSubtaskDto),
      credentials: "include",
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expectHasProperties(data, expectedKeysSubtask);
  });

  test("Update with empty body should fail", async () => {
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({}),
      credentials: "include",
    });

    expect(response.status).toBe(400);
  });

  test("Update with invalid completed type should fail", async () => {
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        completed: "not-a-boolean",
      }),
      credentials: "include",
    });

    expect(response.status).toBe(400);
  });

  test("Update with title too long should fail", async () => {
    const longTitle = "a".repeat(101); // 101 characters, exceeding max of 100
    const response = await appInstance.request("/api/v1/subtasks/subtask-123", {
      method: "PATCH",
      headers: globalThis.authHeader,
      body: JSON.stringify({
        title: longTitle,
      }),
      credentials: "include",
    });

    expect(response.status).toBe(400);
  });
});
