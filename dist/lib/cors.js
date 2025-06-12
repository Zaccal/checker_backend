export const authCors = {
    origin: process.env.ORIGINS.split(" ") || [],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
};
export const globalCors = {
    origin: process.env.ORIGINS.split(" ") || [],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Request-ID"],
    maxAge: 3600,
    credentials: true,
};
