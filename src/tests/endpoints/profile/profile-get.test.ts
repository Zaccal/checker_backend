import type { Session, User } from "better-auth";
import type { Hono } from "hono";
import {
  expectedProfileKeys,
  expectedSessionKeys,
  expectHasProperties,
} from "@/lib/testHelper.js";

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

describe("GET /api/v1/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Get user profile successfully", async () => {
    const response = await appInstance.request("/api/v1/profile", {
      method: "GET",
      credentials: "include",
    });

    const data = (await response.json()) as User & { sessions: Session[] };

    expect(response.status).toBe(200);
    expectHasProperties(data, expectedProfileKeys);

    expect(Array.isArray(data.sessions)).toBe(true);
    if (data.sessions.length > 0) {
      expectHasProperties(data.sessions[0], expectedSessionKeys);
    }
  });

  test("Profile should contain user information", async () => {
    const response = await appInstance.request("/api/v1/profile", {
      method: "GET",
      credentials: "include",
    });

    const data = (await response.json()) as User & { displayUsername: string };

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("displayUsername");
    expect(typeof data.id).toBe("string");
    expect(typeof data.name).toBe("string");
    expect(typeof data.email).toBe("string");
    expect(typeof data.displayUsername).toBe("string");
  });

  test("Profile sessions should have correct structure", async () => {
    const response = await appInstance.request("/api/v1/profile", {
      method: "GET",
      credentials: "include",
    });

    const data = (await response.json()) as User & { sessions: Session[] };

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("sessions");
    expect(Array.isArray(data.sessions)).toBe(true);

    // If sessions exist, check their structure
    if (data.sessions.length > 0) {
      const session = data.sessions[0];
      expect(session).toHaveProperty("id");
      expect(session).toHaveProperty("createdAt");
      expect(session).toHaveProperty("updatedAt");
      expect(session).toHaveProperty("userAgent");
      expect(session).toHaveProperty("ipAddress");

      // Check that dates are valid
      expect(new Date(session.createdAt)).toBeInstanceOf(Date);
      expect(new Date(session.updatedAt)).toBeInstanceOf(Date);
    }
  });
});
