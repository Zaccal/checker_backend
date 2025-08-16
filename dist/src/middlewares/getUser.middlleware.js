import { auth } from '../config/auth.js';
async function userMidllware(c, next) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session) {
        c.set('user', session.user);
        c.set('session', session.session);
        return next();
    }
    return next();
}
export default userMidllware;
