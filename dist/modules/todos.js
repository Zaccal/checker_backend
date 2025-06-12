import { Hono } from "hono";
import { getPrisma } from "../lib/prisma.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/index.js";
import { zValidator } from "@hono/zod-validator";
const todosApp = new Hono();
todosApp.get("/", async (c) => {
    const todos = await getPrisma().todo.findMany();
    return c.json(todos);
});
const todoSchema = z.object({
    title: z.string().min(1),
});
todosApp.post("/", zValidator("json", todoSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { title } = await c.req.json();
    const todo = await getPrisma().todo.create({
        data: {
            title,
        },
    });
    return c.json(todo);
});
todosApp.delete("/:id", async (c) => {
    const { id } = c.req.param();
    try {
        const todo = await getPrisma().todo.delete({
            where: {
                id,
            },
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.notFound();
            }
            return c.json({ error: "An error occurred while deleting the todo." });
        }
    }
});
todosApp.patch("complite/:id", async (c) => {
    const { id } = c.req.param();
    const prisma = getPrisma();
    try {
        const foundTodo = await prisma.todo.findUnique({
            where: {
                id,
            },
        });
        const todo = await prisma.todo.update({
            where: {
                id,
            },
            data: {
                completed: !foundTodo.completed, // Toggle the completed status (foundTodo can not be null here)
            },
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.notFound();
            }
            return c.json({ error: "An error occurred while updating the todo." });
        }
    }
});
todosApp.get("/:id", async (c) => {
    const { id } = c.req.param();
    try {
        const todo = await getPrisma().todo.findUnique({
            where: {
                id,
            },
        });
        if (!todo) {
            return c.notFound();
        }
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.json({
                error: `An error occurred while fetching the todo (${error.message}).`,
            });
        }
    }
});
todosApp.patch("/:id", zValidator("json", todoSchema, (result, c) => {
    if (!result.success) {
        return c.text("Invalide format!", 400);
    }
}), async (c) => {
    const { id } = c.req.param();
    const { title } = await c.req.json();
    try {
        const todo = await getPrisma().todo.update({
            where: {
                id,
            },
            data: {
                title,
            },
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.notFound();
            }
            return c.json({ error: "An error occurred while updating the todo." });
        }
    }
});
export default todosApp;
