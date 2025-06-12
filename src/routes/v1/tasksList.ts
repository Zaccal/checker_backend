import { Hono } from "hono";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { getPrisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import protectLists from "../../middlewares/protectLists.middleware.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";
import { LISTS_SELECT, TODOS_SELECT } from "../../lib/constants.js";

const tasksList = new Hono<{ Variables: AuthVariables }>();

// Scure the subtask routes
tasksList.use("*", protectRoutes);

// Protect the lists which is protected from modify the lists
tasksList.use("/:id/*", protectLists);

// GET
tasksList.get(
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
      const foundLists = await getPrisma().todoList.findMany({
        where: {
          userId,
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: LISTS_SELECT,
      });

      return c.json(foundLists);
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        return c.text(
          `An error occurred while searching the todo lists. (${error.message})`,
          500
        );
      }
    }
  }
);

tasksList.get("/", async (c) => {
  const { id } = c.get("user");
  try {
    const lists = await getPrisma().todoList.findMany({
      where: {
        userId: id,
      },
      select: LISTS_SELECT,
    });

    return c.json(lists);
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return c.text(
        `An error occurred while getting the todo list. (${error.message})`,
        500
      );
    }
  }
});

tasksList.get("/protected", async (c) => {
  const { id: userId } = c.get("user");

  try {
    const lists = await getPrisma().todoList.findMany({
      where: {
        userId,
        protected: true,
      },
      select: {
        ...LISTS_SELECT,
        protected: true,
      },
    });

    return c.json(lists);
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return c.text(
        `An error occurred while getting the protected todo lists. (${error.message})`,
        500
      );
    }
  }
});

tasksList.get("/:id", async (c) => {
  const { id } = c.req.param();
  const { id: userId } = c.get("user");

  try {
    const foundList = await getPrisma().todoList.findFirst({
      where: {
        id,
        userId,
      },
      select: LISTS_SELECT,
    });

    if (!foundList) {
      return c.notFound();
    }

    return c.json(foundList);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text(
        `An error occurred while getting the todo list. (${error.message})`,
        500
      );
    }

    return c.text("An error occurred while getting the todo list.", 500);
  }
});

// POST

const createListSchema = z.object({
  icon: z.string().min(2),
  title: z.string().min(2).max(50),
});

export type CreateListDto = z.infer<typeof createListSchema>;

tasksList.post(
  "/",
  zValidator("json", createListSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid request body", 400);
    }
  }),
  async (c) => {
    const { icon, title } = c.req.valid("json");
    const { id: userId } = c.get("user");

    try {
      const createdList = await getPrisma().todoList.create({
        data: {
          title,
          icon,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        select: LISTS_SELECT,
      });

      return c.json(createdList);
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        return c.text(
          `An error occurred while creating the todo list. (${error.message})`,
          500
        );
      }
    }
  }
);

// PATCH

const updateListSchema = z.object({
  icon: z.string().min(2).optional(),
  title: z.string().min(2).max(50).optional(),
});

tasksList.patch(
  "/:id",
  zValidator("json", updateListSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid request body", 400);
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const { icon, title } = c.req.valid("json");
    const { id: userId } = c.get("user");

    if (!icon && !title) {
      return c.text("At least one field (icon or title) must be provided", 400);
    }

    try {
      const updatedList = await getPrisma().todoList.update({
        where: {
          id,
          userId,
        },
        data: {
          title,
          icon,
        },
        select: LISTS_SELECT,
      });

      if (!updatedList) {
        return c.notFound();
      }

      return c.json(updatedList);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.notFound();
        }

        return c.text(
          `An error occurred while updating the todo list. (${error.message})`,
          500
        );
      }

      return c.text("An error occurred while updating the todo list.", 500);
    }
  }
);

// add task to list
tasksList.patch("/:id/:taskId", async (c) => {
  const { id, taskId } = c.req.param();
  const { id: userId } = c.get("user");

  try {
    const foundList = await getPrisma().todoList.update({
      where: {
        id,
        userId,
      },
      data: {
        todos: {
          connect: {
            id: taskId,
          },
        },
      },
      select: LISTS_SELECT,
    });

    if (!foundList) {
      return c.notFound();
    }
    return c.json({ success: true }, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text(
        `An error occurred while adding the task to the todo list. (${error.message})`,
        500
      );
    }

    return c.text(
      "An error occurred while adding the task to the todo list.",
      500
    );
  }
});

// DELETE

tasksList.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const { id: userId } = c.get("user");

  try {
    await getPrisma().todoList.delete({
      where: {
        id,
        userId,
      },
      select: LISTS_SELECT,
    });

    return c.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.notFound();
      }

      return c.text(
        `An error occurred while deleting the todo list. (${error.message})`,
        500
      );
    }

    return c.text("An error occurred while deleting the todo list.", 500);
  }
});

export default tasksList;
