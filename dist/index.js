import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authApp, todosApp } from "./modules/index.js";
import { cors } from "hono/cors";
import { authCors, globalCors } from "./lib/cors.js";
import { userMidllware, authMiddleware } from "./middlewares/index.js";
const app = new Hono().basePath("/api");
// Set CORS for different routes
app.use("/auth/*", cors(authCors));
app.use("*", cors(globalCors));
// Middleware for get user for every route
app.use("*", userMidllware);
// Middleware for auth handler
app.use("/todos/*", authMiddleware);
// Routes
app.route("/todos", todosApp);
app.route("/auth", authApp);
serve({
    fetch: app.fetch,
    port: 5000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port} 🥳`);
});
