import { Hono } from "hono";
import { getPrisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import { zValidator } from "@hono/zod-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import { TODOS_SELECT } from "../../lib/constants.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";
import { todoCompletedSchema, todoCreateSchema, todoUpdateSchema, } from "../../schemas/todos.schemas.js";
const todosApp = new Hono();
// Secure the todos routes
todosApp.use("*", protectRoutes);
// GET
todosApp.get("/search", zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalid query format!", 400);
    }
}), async (c) => {
    const { query, offset, limit } = c.req.valid("query");
    const userId = c.get("user").id;
    try {
        const foundTodos = await getPrisma().todo.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
                userId,
            },
            skip: offset,
            take: limit,
            select: TODOS_SELECT,
        });
        return c.json(foundTodos);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(`An error occurred while searching for todos. (${error.message})`, 500);
        }
    }
});
todosApp.get("/:id", async (c) => {
    const user = c.get("user");
    const { id } = c.req.param();
    try {
        const todos = await getPrisma().todo.findFirst({
            where: {
                userId: user.id,
                OR: [
                    {
                        todoListId: id,
                    },
                    { id: id },
                ],
            },
            select: TODOS_SELECT,
        });
        if (!todos) {
            return c.text("Todo not found.", 404);
        }
        return c.json(todos);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(error.message, 500);
        }
        c.text("An error occurred while getting the todos.", 500);
    }
});
// POST
todosApp.post("/", zValidator("json", todoCreateSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { title, taskListId } = c.req.valid("json");
    const user = c.get("user");
    try {
        const todo = await getPrisma().todo.create({
            data: {
                title,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                todoList: {
                    connect: {
                        id: taskListId,
                    },
                },
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof PrismaClientKnownRequestError ||
            error instanceof Error) {
            c.text(error.message, 500);
        }
        c.text("An error occurred while creating the todo.", 500);
    }
});
// DELETE
todosApp.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    try {
        await getPrisma().todo.delete({
            where: {
                id,
                userId: user.id,
            },
        });
        return c.json({ message: "Task has deleted successfully" });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Todo not found.", 404);
            }
            return c.text(`An error occurred while deleting the todo: ${error.message}`, 500);
        }
        return c.text("An error occurred while geting the todo.", 500);
    }
});
// PATCH
todosApp.patch("complite/:id", zValidator("json", todoCompletedSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const { complited } = c.req.valid("json");
    const prisma = getPrisma();
    const user = c.get("user");
    try {
        const todo = await prisma.todo.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                completed: complited,
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Todo not found.", 404);
            }
            return c.text(`An error occurred while geting the todo: ${error.message}`, 500);
        }
        return c.text("An error occurred while geting the todo.", 500);
    }
});
todosApp.patch("/:id", zValidator("json", todoUpdateSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const { title, expiresAt } = c.req.valid("json");
    try {
        const todo = await getPrisma().todo.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                title,
                expiresAt,
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Todo not found.", 404);
            }
            return c.text("An error occurred while geting the todo.", 500);
        }
    }
});
export default todosApp;
