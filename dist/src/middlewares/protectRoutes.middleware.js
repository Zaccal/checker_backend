import { auth } from "../lib/auth-instance.js";
async function protectRoutes(c, next) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session || !session.user) {
        return c.text("Not found", 401);
    }
    return next();
}
export default protectRoutes;
