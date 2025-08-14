export const mockGetUserMiddleware = (c, next) => {
    c.set('user', {
        id: '111',
    });
    c.set('session', {
        userId: '111',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day later
    });
    return next();
};
export const mockSkipProtectedRoute = {
    default: async (_, next) => {
        return next();
    },
};
