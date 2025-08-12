import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { PORT } from "./lib/constants.js";
serve({
    fetch: app.fetch,
    port: PORT,
}, (info) => {
    console.log(`Server is running on http://localhost:${String(info.port)} 🚀`);
});
