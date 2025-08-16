import { expectHasProperties, expectedKeysTodo } from '../../../lib/testHelper.js';
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
    const { app } = await import('../../../app.js');
    appInstance = app;
});
describe('PATCH method', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test('PATCH method for edit a todo', async () => {
        const response = await appInstance.request('/api/v1/todos/123', {
            method: 'PATCH',
            body: JSON.stringify({
                title: 'Test Todo',
            }),
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expectHasProperties(data, expectedKeysTodo);
    });
    test('PATCH method for toggle complite a todo', async () => {
        const response = await appInstance.request('api/v1/todos/complite/123', {
            method: 'PATCH',
            headers: globalThis.authHeader,
            body: JSON.stringify({
                complited: true,
            }),
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expectHasProperties(data, expectedKeysTodo);
    });
});
