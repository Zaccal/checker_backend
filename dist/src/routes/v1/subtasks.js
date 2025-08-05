import { Hono } from "hono";
import { Prisma } from "../../generated/prisma/index.js";
import { getPrisma } from "../../lib/prisma.js";
import { zValidator } from "@hono/zod-validator";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";
import { subtaskCreateSchema, subtaskUpdateSchema, } from "../../schemas/subtasks.schemas.js";
import { SUBTASKS_SELECT } from "../../lib/constants.js";
const subTaskApp = new Hono();
// Scure the subtask routes
subTaskApp.use("*", protectRoutes);
// GET
subTaskApp.get("/search", zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
        return c.text(result.error.message || "Invalid query format!", 400);
    }
}), async (c) => {
    const { query, offset, limit } = c.req.valid("query");
    const { id: userId } = c.get("user");
    try {
        const foundSubtasks = await getPrisma().subTask.findMany({
            where: {
                title: {
                    contains: query,
                },
                todo: {
                    userId,
                },
            },
            select: SUBTASKS_SELECT,
            skip: offset,
            take: limit,
        });
        return c.json(foundSubtasks);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            c.text(error.message, 500);
        }
    }
});
subTaskApp.get("/:id", async (c) => {
    const { id } = c.req.param();
    const { id: userId } = c.get("user");
    try {
        const subtasks = await getPrisma().subTask.findFirst({
            where: {
                todo: {
                    userId,
                },
                OR: [
                    {
                        todoId: id,
                    },
                    {
                        id,
                    },
                ],
            },
            select: SUBTASKS_SELECT,
        });
        if (!subtasks) {
            return c.text("Subtasks not found for this todo.", 404);
        }
        return c.json(subtasks);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(`An error occurred while geting the todo: ${error.message}`, 500);
        }
        return c.text("An error occurred while geting the todo", 500);
    }
});
// POST
subTaskApp.post("/", zValidator("json", subtaskCreateSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { title, taskId } = c.req.valid("json");
    try {
        const createdSubtask = await getPrisma().subTask.create({
            data: {
                title,
                todo: {
                    connect: {
                        id: taskId,
                    },
                },
            },
            select: SUBTASKS_SELECT,
        });
        return c.json(createdSubtask);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(`An error occurred while creating the subtask: ${error.message}`, 500);
        }
        return c.text("An error occurred while geting the todo.", 500);
    }
});
// PATCH
subTaskApp.patch("/:id", zValidator("json", subtaskUpdateSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const { title, completed } = c.req.valid("json");
    const { id: userId } = c.get("user");
    try {
        const updatedSubtask = await getPrisma().subTask.update({
            where: {
                id,
                todo: {
                    userId,
                },
            },
            select: SUBTASKS_SELECT,
            data: {
                title,
                completed,
            },
        });
        return c.json(updatedSubtask);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Subtask not found.", 404);
            }
        }
        return c.text("An error occurred while geting the todo.", 500);
    }
});
// DELETE
subTaskApp.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const { id: userId } = c.get("user");
    try {
        await getPrisma().subTask.delete({
            where: {
                id,
                todo: {
                    userId,
                },
            },
        });
        return c.json({ message: "Subtask has deleted successfully" });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Subtask not found", 404);
            }
            c.text(`An error occurred while deleting the subtask: ${error.message}`, 500);
        }
        return c.text(`An error occurred while geting the subtask`, 500);
    }
});
export default subTaskApp;
