import { app } from "./app.js";
import { handle } from "hono/vercel";

// serve(
//   {
//     fetch: app.fetch,
//     port: PORT,
//   },
//   (info) => {
//     console.log(`Server is running on http://localhost:${info.port} 🚀`);
//   },
// );

export const all = handle(app);
