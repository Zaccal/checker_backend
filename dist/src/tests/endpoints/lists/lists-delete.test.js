vi.mock("../../../lib/prisma.js", async () => {
    const { mockPrisma } = await import("../../mock/prisma.mock.js");
    return mockPrisma;
});
vi.mock("../../../middlewares/protectRoutes.middleware.js", async () => {
    const { mockSkipProtectedRoute } = await import("../../mock/authMiddlewares.mock.js");
    return mockSkipProtectedRoute;
});
vi.mock("../../../middlewares/getUser.middlleware.js", async () => {
    const { mockGetUserMiddleware } = await import("../../mock/authMiddlewares.mock.js");
    return {
        default: mockGetUserMiddleware,
    };
});
let appInstance;
beforeAll(async () => {
    const { app } = await import("../../../app.js");
    appInstance = app;
});
describe("DELETE Method", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    test("should delete a list", async () => {
        const response = await appInstance.request("/api/v1/lists/123", {
            method: "DELETE",
        });
        const data = await response.json();
        console.log(data);
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(data).toEqual({
            success: true,
        });
    });
});
export {};
