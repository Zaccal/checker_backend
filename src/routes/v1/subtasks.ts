import { Hono } from "hono";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { Prisma } from "../../generated/prisma/index.js";
import { getPrisma } from "../../lib/prisma.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";

const subTaskApp = new Hono<{ Variables: AuthVariables }>();

// Scure the subtask routes
subTaskApp.use("*", protectRoutes);

// GET

subTaskApp.get(
  "/search",
  zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid query format!", 400);
    }
  }),
  async (c) => {
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
        skip: offset,
        take: limit,
      });

      return c.json(foundSubtasks);
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        c.text(error.message, 500);
      }
    }
  }
);

subTaskApp.get("/:todoId", async (c) => {
  const { todoId } = c.req.param();
  const { id } = c.get("user");

  try {
    const subtasks = await getPrisma().subTask.findMany({
      where: {
        todoId,
        todo: {
          userId: id,
        },
      },
    });

    return c.json(subtasks);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text("An error occurred while geting the todo.", 500);
    }
  }
});

subTaskApp.get("/:todoId/:id", async (c) => {
  const { todoId, id } = c.req.param();
  const { id: userId } = c.get("user");

  try {
    const subtaskFound = await getPrisma().subTask.findFirst({
      where: {
        todoId,
        id,
        todo: {
          userId,
        },
      },
    });

    if (!subtaskFound) {
      return c.notFound();
    }

    return c.json(subtaskFound);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text("An error occurred while geting the todo.", 500);
    }
  }
});

// POST
const subtaskCreateSchema = z.object({
  title: z.string().min(1).max(100),
});

subTaskApp.post(
  "/:todoId",
  zValidator("json", subtaskCreateSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalide format!", 400);
    }
  }),
  async (c) => {
    const { title } = c.req.valid("json");
    const { todoId } = c.req.param();

    try {
      const createdSubtask = await getPrisma().subTask.create({
        data: {
          title,
          todo: {
            connect: {
              id: todoId,
            },
          },
        },
      });

      return c.json(createdSubtask);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }
      }

      return c.text("An error occurred while geting the todo.", 500);
    }
  }
);

// PATCH
const subtaskUpdateSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

// "id" param is the subtask id, not the todo id
subTaskApp.patch(
  "/:id",
  zValidator("json", subtaskUpdateSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalide format!", 400);
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const { title, completed } = c.req.valid("json");
    const { id: userId } = c.get("user");

    if (!title && completed === undefined) {
      return c.text("Please provide a title or completed value", 400);
    }

    try {
      const updatedSubtask = await getPrisma().subTask.update({
        where: {
          id,
          todo: {
            userId,
          },
        },
        data: {
          title,
          completed,
        },
      });

      return c.json(updatedSubtask);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }
      }

      return c.text("An error occurred while geting the todo.", 500);
    }
  }
);

// DELETE

// "id" param is the subtask id, not the todo id
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

    return c.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }
    }

    return c.text("An error occurred while geting the todo.", 500);
  }
});

export default subTaskApp;
