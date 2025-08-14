import { Hono } from 'hono';
import { auth } from '../config/auth.js';
const authApp = new Hono({
    strict: true,
});
authApp.on(['POST', 'GET'], '/*', async (c) => {
    return auth.handler(c.req.raw);
});
export default authApp;
