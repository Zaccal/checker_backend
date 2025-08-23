import { expectedKeysTags, expectHasProperties } from '../../../lib/testHelper.js';
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
let appIntance;
beforeAll(async () => {
    const app = await import('../../../app.js');
    appIntance = app.default;
});
describe('POST Method', () => {
    it('should return a new tag', async () => {
        const res = await appIntance.request('/api/v1/tags', {
            method: 'POST',
            headers: globalThis.authHeader,
            body: JSON.stringify({
                name: 'Test',
                color: 'blue',
                todoId: '123',
            }),
        });
        const data = (await res.json());
        expect(res.status).toBe(200);
        expectHasProperties(data, expectedKeysTags);
    });
});
