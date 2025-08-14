export const errorHandler = (err, c) => {
    const currentStatus = 'status' in err ? err.status : c.newResponse(null).status;
    const statusCode = currentStatus !== 200 ? currentStatus : 500;
    const env = c.env?.NODE_ENV ??
        process.env.NODE_ENV;
    return c.json({
        success: false,
        message: err.message,
        stack: env ? null : err.stack,
    }, statusCode);
};
export const notFound = c => {
    return c.json({
        success: false,
        message: `Not Found - [${c.req.method}]:[${c.req.url}]`,
    }, 404);
};
