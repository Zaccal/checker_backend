import type { Prisma } from "../generated/prisma/index.js";

export type TodoSelectedResponse = Prisma.TodoGetPayload<{
  select: {
    id: true;
    title: true;
    completed: true;
    expiresAt: true;
    tags: true;
    subTasks: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
