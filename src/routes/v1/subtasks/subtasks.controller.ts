import { getPrisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/index.js";
import { SUBTASKS_SELECT } from "@/lib/constants.js";
import type { ContextAuth } from "@/lib/types.js";
import type { SearchQueryDto } from "@/schemas/searchQuery.schemas.js";
import type {
  SubtaskCreateSchema,
  SubtaskUpdateSchema,
} from "@/schemas/subtasks.schemas.js";

export async function getSearchSubtasks(
  c: ContextAuth,
  queryParams: SearchQueryDto
) {
  const { query, offset, limit } = queryParams;
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
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      c.text(error.message, 500);
    }
  }
}

export async function getSubtasksById(c: ContextAuth, id: string) {
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
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(
        `An error occurred while geting the subtasks: ${error.message}`,
        500
      );
    }
    return c.text("An error occurred while geting the subtasks", 500);
  }
}

export async function createSubtask(c: ContextAuth, data: SubtaskCreateSchema) {
  const { title, taskId } = data;

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
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(
        `An error occurred while creating the subtask: ${error.message}`,
        500
      );
    }

    return c.text("An error occurred while geting the todo.", 500);
  }
}

export async function updateSubtask(
  c: ContextAuth,
  data: SubtaskUpdateSchema,
  id: string
) {
  const { title, completed } = data;
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.text("Subtask not found.", 404);
      }
    }

    return c.text("An error occurred while geting the subtask.", 500);
  }
}

export async function deleteSubtask(c: ContextAuth, id: string) {
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return c.text("Subtask not found", 404);
      }

      c.text(
        `An error occurred while deleting the subtask: ${error.message}`,
        500
      );
    }

    return c.text(`An error occurred while geting the subtask`, 500);
  }
}
