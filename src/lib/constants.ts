import type { Prisma } from "../generated/prisma/index.js";

export const API_VERSION = process.env.VERSION || "v1";
export const API_PREFIX = process.env.PREFIX || "/api";
export const BASE_PATH = `${API_PREFIX}/${API_VERSION}`;
export const PORT = Number(process.env.PORT || 3500);

export const TODOS_SELECT: Prisma.TodoSelect = {
  createdAt: true,
  updatedAt: true,
  id: true,
  title: true,
  completed: true,
  expiresAt: true,
  tags: true,
  subTasks: true,
};

export const LISTS_SELECT: Prisma.TodoListSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  icon: true,
  title: true,
  todos: true,
};
