import dotenv from 'dotenv';
import { cors } from 'hono/cors';
dotenv.config();
const allowedOrigins = process.env.ORIGINS?.split(',') ?? [];
export const authCors = cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
});
export const globalCors = cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
});
