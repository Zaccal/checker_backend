import protectRoutes from "./protectRoutes.middleware.js";
import userMidllware from "./getUser.middlleware.js";
import { errorHandler, notFound } from "./error.middleware.js";
import protectLists from "./protectLists.middleware.js";

export { protectRoutes, userMidllware, errorHandler, notFound, protectLists };
