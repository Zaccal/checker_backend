import { Hono } from "hono";
import type { AuthVariables } from "../../lib/auth-instance.js";
import { getPrisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import { zValidator } from "@hono/zod-validator";
import { TAGS_SELECT } from "../../lib/constants.js";
import { SearchQuerySchema } from "../../schemas/searchQuery.schemas.js";
import {
  tagCreateSchema,
  tagUpdateSchema,
} from "../../schemas/tags.schemas.js";

const tagsApp = new Hono<{ Variables: AuthVariables }>();
const prisma = getPrisma();

// GET

tagsApp.get(
  "/search",
  zValidator("query", SearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid form query", 400);
    }
  }),
  async (c) => {
    const { query, limit, offset } = c.req.valid("query");
    const { id: userId } = c.get("user");

    try {
      const foundTags = await prisma.tag.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          userId,
        },
        skip: offset,
        take: limit,
        select: TAGS_SELECT,
      });

      return c.json(foundTags);
    } catch (error) {
      if (error instanceof Error || Prisma.PrismaClientKnownRequestError) {
      }

      c.text("An error occurred while searching for tags", 500);
    }
  }
);

tagsApp.get("/", async (c) => {
  try {
    const tags = await prisma.tag.findMany({
      select: TAGS_SELECT,
    });

    return c.json(tags);
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      c.text(error.message, 500);
    }
    return c.text("An unknown error occurred", 500);
  }
});

tagsApp.get("/:id", async (c) => {
  const { id } = c.req.param();

  try {
    const foundTag = await prisma.tag.findFirst({
      where: {
        id,
      },
      select: TAGS_SELECT,
    });

    return c.json(foundTag);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(error.message, 500);
    }

    return c.text("An error occurred while geting the todo.", 500);
  }
});

// POST

tagsApp.post(
  "/",
  zValidator("json", tagCreateSchema, (result, c) => {
    if (!result.success) {
      c.text("Invalid format!", 400);
    }
  }),
  async (c) => {
    const { todoId, ...body } = c.req.valid("json");
    const { id: userId } = c.get("user");

    try {
      const createdTag = await prisma.tag.create({
        data: {
          ...body,
          todos: {
            connect: {
              id: todoId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        select: TAGS_SELECT,
      });

      return c.json(createdTag);
    } catch (error) {
      console.log(error);

      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        return c.text(error.message, 500);
      }

      c.text("An unknown error occurred while creating the tag", 500);
    }
  }
);

// PATCH

tagsApp.patch(
  "/:id",
  zValidator("json", tagUpdateSchema, (result, c) => {
    if (!result.success) {
      c.text("Invalid format!", 400);
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const { id: userId } = c.get("user");

    try {
      const updatedTag = await prisma.tag.update({
        where: {
          id,
          userId,
        },
        data: body,
        select: TAGS_SELECT,
      });

      return c.json(updatedTag);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Error
      ) {
        return c.text(error.message, 500);
      }

      return c.text("An error occurred while updating the tag.", 500);
    }
  }
);

// DELETE

tagsApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const { id: userId } = c.get("user");

  try {
    const deletedTag = await prisma.tag.delete({
      where: {
        id,
        userId,
      },
      select: TAGS_SELECT,
    });

    return c.json({ message: "Tag deleted successfully" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(error.message, 500);
    }

    return c.text("An error occurred while deleting the tag.", 500);
  }
});

export default tagsApp;
