import type { ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

export const errorHandler: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;

  const statusCode =
    currentStatus !== 200 ? (currentStatus as StatusCode) : 500;
  const env =
    (c.env as Record<string, unknown> | undefined)?.NODE_ENV ??
    process.env.NODE_ENV;

  return c.json(
    {
      success: false,
      message: err.message,
      stack: env ? null : err.stack,
    },
    statusCode as ContentfulStatusCode
  );
};

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: `Not Found - [${c.req.method}]:[${c.req.url}]`,
    },
    404
  );
};
