import { Hono } from "hono";
import { getPrisma } from "../../lib/prisma.js";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/index.js";
import { zValidator } from "@hono/zod-validator";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import { TODOS_SELECT } from "../../lib/constants.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";

const todosApp = new Hono<{ Variables: AuthVariables }>();

// Secure the todos routes
todosApp.use("*", protectRoutes);

// GET

todosApp.get(
  "/search",
  zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid query format!", 400);
    }
  }),
  async (c) => {
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Error
      ) {
        return c.text(
          `An error occurred while searching for todos. (${error.message})`,
          500
        );
      }
    }
  }
);

todosApp.get("/:id", async (c) => {
  const user = c.get("user");
  const { id } = c.req.param();

  try {
    const todos = await getPrisma().todo.findMany({
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

    return c.json(todos);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      c.text(error.message, 500);
    }

    c.text("An error occurred while getting the todos.", 500);
  }
});

// POST

const todoCreateSchema = z.object({
  title: z.string().min(1).max(100),
  taskListId: z.string(),
});

export type TodoCreateDto = z.infer<typeof todoCreateSchema>;

todosApp.post(
  "/",
  zValidator("json", todoCreateSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalide format!", 400);
    }
  }),
  async (c) => {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }

        c.text(error.message, 500);
      }
      c.text("An error occurred while creating the todo.", 500);
    }
  }
);

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
    return c.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text("An error occurred while geting the todo.", 500);
    }
  }
});

// PATCH

const todoCompletedSchema = z.object({
  complited: z.boolean(),
});

type TodoCompletedDto = z.infer<typeof todoCompletedSchema>;

todosApp.patch(
  "complite/:id",
  zValidator("json", todoCompletedSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalide format!", 400);
    }
  }),
  async (c) => {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }

        return c.text("An error occurred while geting the todo.", 500);
      }
    }
  }
);

const todoUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  expiresAt: z.date().optional(),
  todoListId: z.string().optional(),
  tags: z.array(z.string()).optional(), // Array of ids
  // TODO: Check does it works correct when I send the tags
});

// TODO: Check this endpoint when you create a todoList and tags
todosApp.patch(
  "/:id",
  zValidator("json", todoUpdateSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalide format!", 400);
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const { title, expiresAt, tags, todoListId } = c.req.valid("json");

    try {
      const todo = await getPrisma().todo.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          title,
          expiresAt,
          tags: {
            set: tags ? tags.map((tag) => ({ id: tag })) : undefined,
          },
          todoList: {
            connect: todoListId ? { id: todoListId } : undefined,
          },
        },
        select: TODOS_SELECT,
      });

      return c.json(todo);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }

        return c.text("An error occurred while geting the todo.", 500);
      }
    }
  }
);

export default todosApp;
