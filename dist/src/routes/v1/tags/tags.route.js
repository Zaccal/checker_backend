import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTag, deleteTag, getSearchTag, getTagById, getTags, updateTag, } from "./tags.controller.js";
import { SearchQuerySchema } from "@/schemas/searchQuery.schemas.js";
import { tagCreateSchema, tagUpdateSchema } from "@/schemas/tags.schemas.js";
const tagsApp = new Hono();
// GET
tagsApp.get("/search", zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalid form query", 400);
    }
}), async (c) => {
    const queryParams = c.req.valid("query");
    return await getSearchTag(c, queryParams);
});
tagsApp.get("/", async (c) => {
    return await getTags(c);
});
tagsApp.get("/:id", async (c) => {
    const { id } = c.req.param();
    return await getTagById(c, id);
});
// POST
tagsApp.post("/", zValidator("json", tagCreateSchema, (result, c) => {
    if (!result.success) {
        c.text("Invalid format!", 400);
    }
}), async (c) => {
    const { todoId, ...body } = c.req.valid("json");
    return await createTag(c, body, todoId);
});
// PATCH
tagsApp.patch("/:id", zValidator("json", tagUpdateSchema, (result, c) => {
    if (!result.success) {
        c.text("Invalid format!", 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    return await updateTag(c, body, id);
});
// DELETE
tagsApp.delete("/:id", async (c) => {
    const { id } = c.req.param();
    return await deleteTag(c, id);
});
export default tagsApp;
