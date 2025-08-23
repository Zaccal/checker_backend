export const config = {
    runtime: 'nodejs',
};
import { handle } from '@hono/node-server/vercel';
// @ts-expect-error - Importing compiled JS file
import app from '../dist/src/app.js';
export default handle(app);
