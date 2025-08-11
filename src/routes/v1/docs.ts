import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { BASE_PATH } from "../../lib/constants.js";
import { documentation } from "../../lib/documentation.js";
const docApp = new OpenAPIHono();

docApp.doc("/doc", documentation);
docApp.get("/ui", swaggerUI({ url: `/${BASE_PATH}/doc` }));

export default docApp;
