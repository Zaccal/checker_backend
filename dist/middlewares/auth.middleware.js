async function authMiddleware(c, next) {
    const user = await c.get("session");
    const session = await c.get("session");
    if (!user && !session) {
        return c.text("Not Found", 404);
    }
    return next();
}
export default authMiddleware;
