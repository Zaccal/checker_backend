export const config = {
    runtime: 'nodejs',
};
import { handle } from '@hono/node-server/vercel';
import { app } from '../src/app.js';
export default handle(app);
