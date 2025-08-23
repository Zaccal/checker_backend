vi.mock('../../../lib/prisma.ts', async () => {
    const { mockPrisma } = await import('../../mock/prisma.mock.js');
    return mockPrisma;
});
vi.mock('../../../middlewares/protectRoutes.middleware.ts', async () => {
    const { mockSkipProtectedRoute } = await import('../../mock/authMiddlewares.mock.js');
    return mockSkipProtectedRoute;
});
vi.mock('../../../middlewares/getUser.middlleware.ts', async () => {
    const { mockGetUserMiddleware } = await import('../../mock/authMiddlewares.mock.js');
    return {
        default: mockGetUserMiddleware,
    };
});
let appInstance;
beforeAll(async () => {
    const app = await import('../../../app.js');
    appInstance = app.default;
});
describe('DELETE Method', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    test('should delete a todo', async () => {
        const response = await appInstance.request('/api/v1/todos/123', {
            method: 'DELETE',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(data).toEqual({
            success: true,
        });
    });
});
export {};
