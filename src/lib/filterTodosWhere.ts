import type { Prisma } from "../generated/prisma/index.js";
import type { FilterTodosDto } from "../schemas/taskList.schemas.js";

export const filterTodosWhere = (
  filter: Omit<FilterTodosDto, "sortBy" | "sortOrder">,
  listId: string,
  userId: string
) => {
  const {
    completed,
    withDeadline,
    onlyExpired,
    createdFrom,
    createdTo,
    tagIds,
  } = filter;

  const where: Prisma.TodoWhereInput = {
    todoListId: listId,
    userId,
    ...(completed !== undefined && { completed }),
    ...((withDeadline ?? onlyExpired) && {
      expiresAt: {
        ...(withDeadline && { not: null }),
        ...(onlyExpired && { lte: new Date() }),
      },
    }),

    ...((createdFrom ?? createdTo) && {
      createdAt: {
        ...(createdFrom && {
          gte: (() => {
            const date = new Date(createdFrom);
            date.setUTCDate(date.getUTCDate() - 1);
            return date;
          })(),
        }),
        ...(createdTo && {
          lte: (() => {
            const date = new Date(createdTo);
            date.setUTCDate(date.getUTCDate() + 1);
            return date;
          })(),
        }),
      },
    }),
    ...(tagIds?.length && {
      tags: {
        some: {
          id: { in: tagIds },
        },
      },
    }),
  };

  return where;
};
