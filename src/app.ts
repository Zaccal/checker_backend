import { Hono } from "hono";
import { authApp, subTaskApp, tasksList, todosApp } from "./routes/v1/index.js";
import { cors } from "hono/cors";
import { authCors, globalCors } from "./lib/cors.js";
import { userMidllware, errorHandler, notFound } from "./middlewares/index.js";
import { BASE_PATH } from "./lib/constants.js";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { transport } from "./lib/email.js";

const app = new Hono().basePath(BASE_PATH);

// Set CORS for different routes
app.use("/auth/*", cors(authCors));
app.use("*", cors(globalCors));

// Middleware for get user for every route
app.use("*", userMidllware);

// Logging middleware
app.use(logger());
// Compression middleware, enabled only in production
if (process.env.NODE_ENV === "production") {
  app.use(compress({ encoding: "gzip" }));
}

// Routes
app.route("/todos", todosApp);
app.route("/todos/subtasks", subTaskApp);
app.route("/lists", tasksList);
app.route("/auth", authApp);

app.get("/testemail", async (c) => {
  try {
    transport.sendMail(
      {
        from: "checker_webapp@mail.ru",
        to: "ksss90411@gmail.com",
        subject: "testing",
        text: "Everything work",
      },
      (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log("send " + info);
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      c.text(error.message, 500);
    }
    c.text("Opss!");
  }
});

// Error Handler (improved to use err)
app.onError(errorHandler);

// Not Found Handler (standardized response)
app.notFound(notFound);

export { app };
