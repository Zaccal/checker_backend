import { Hono } from "hono";
import {
  authApp,
  docApp,
  profileApp,
  subTaskApp,
  tagsApp,
  tasksList,
  todosApp,
} from "./routes/v1/index.js";
import { authCors, globalCors } from "./lib/cors.js";
import { userMidllware, errorHandler, notFound } from "./middlewares/index.js";
import { BASE_PATH } from "./lib/constants.js";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import authCustom from "./routes/authCustom.js";

const app = new Hono().basePath(BASE_PATH);

// Set CORS for different routes
app.use("/*", globalCors);
app.use("/auth/*", authCors);

// Middleware for get user for every route
app.use("*", userMidllware);

// Logging middleware
// app.use(logger());
// Compression middleware, enabled only in production
if (process.env.NODE_ENV === "production") {
  app.use(compress({ encoding: "gzip" }));
}

// Routes
app.route("/todos", todosApp);
app.route("/subtasks", subTaskApp);
app.route("/lists", tasksList);
app.route("/tags", tagsApp);
app.route("/auth", authApp);
app.route("/auth-custom", authCustom);
app.route("/profile", profileApp);

// Docs
app.route("/", docApp);

// Error Handler (improved to use err)
app.onError(errorHandler);

// Not Found Handler (standardized response)
app.notFound(notFound);

export { app };
