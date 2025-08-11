import { errorHandler, notFound } from "./error.middleware.js";
import userMidllware from "./getUser.middlleware.js";
import protectLists from "./protectLists.middleware.js";
import protectRoutes from "./protectRoutes.middleware.js";

export { protectRoutes, userMidllware, errorHandler, notFound, protectLists };
