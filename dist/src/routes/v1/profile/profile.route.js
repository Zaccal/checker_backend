import { Hono } from 'hono';
import { getProfile } from './profile.controller.js';
import protectRoutes from '@/middlewares/protectRoutes.middleware.js';
const profileApp = new Hono();
profileApp.use('*', protectRoutes);
profileApp.get('/', async (c) => {
    return await getProfile(c);
});
export default profileApp;
