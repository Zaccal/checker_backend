vi.mock("../../../lib/prisma.ts", async () => {
    const { mockPrisma } = await import("../../mock/prisma.mock.js");
    return mockPrisma;
});
vi.mock("../../../middlewares/protectRoutes.middleware.ts", async () => {
    const { mockSkipProtectedRoute } = await import("../../mock/authMiddlewares.mock.js");
    return mockSkipProtectedRoute;
});
vi.mock("../../../middlewares/getUser.middlleware.ts", async () => {
    const { mockGetUserMiddleware } = await import("../../mock/authMiddlewares.mock.js");
    return {
        default: mockGetUserMiddleware,
    };
});
let appIntance;
beforeAll(async () => {
    const { app } = await import("../../../app.js");
    appIntance = app;
});
describe("DELTE Method", () => {
    it("should delete a tag", async () => {
        const res = await appIntance.request("/api/v1/tags/123", {
            method: "DELETE",
            headers: globalThis.authHeader,
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({ message: "Tag deleted successfully" });
    });
});
export {};
