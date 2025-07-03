import { Hono } from "hono";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { getPrisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import { zValidator } from "@hono/zod-validator";
import protectRoutes from "../../middlewares/protectRoutes.middleware.js";
import protectLists from "../../middlewares/protectLists.middleware.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";
import { LISTS_SELECT, TODOS_SELECT } from "../../lib/constants.js";
import {
  createListSchema,
  updateListSchema,
} from "../../schemas/taskList.schemas.js";

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
        protected: false,
      },
      select: LISTS_SELECT,
      orderBy: {
        createdAt: "desc",
      },
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
      select: {
        ...LISTS_SELECT,
        todos: {
          select: TODOS_SELECT,
        },
      },
    });

    if (!foundList) {
      return c.notFound();
    }

    return c.json(foundList);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(
        `An error occurred while getting the todo list. (${error.message})`,
        500
      );
    }

    return c.text("An error occurred while getting the todo list.", 500);
  }
});

// POST

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

      return c.json(updatedList);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return c.text("Todo list not found.", 404);
        }

        return c.text(
          `An error occurred while updating the todo list: ${error.message}`,
          500
        );
      }

      return c.text("An error occurred while updating the todo list.", 500);
    }
  }
);

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
    });

    return c.json({ message: "List has deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.text("Todo list not found.", 404);
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
