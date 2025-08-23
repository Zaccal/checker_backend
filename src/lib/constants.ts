import type { Prisma } from '@/generated/prisma/index.js'

export const API_VERSION = process.env.VERSION ?? 'v1'
export const API_PREFIX = process.env.PREFIX ?? '/api'
export const BASE_PATH = `${API_PREFIX}/${API_VERSION}`
export const PORT = Number(process.env.PORT ?? 3500)

export const TAGS_SELECT: Prisma.TagSelect = {
  createdAt: true,
  updatedAt: true,
  id: true,
  name: true,
  todos: {
    select: {
      id: true,
      title: true,
      completed: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
}

export const SUBTASKS_SELECT: Prisma.SubTaskSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  completed: true,
  todoId: true,
}

export const TODOS_SELECT: Prisma.TodoSelect = {
  createdAt: true,
  updatedAt: true,
  id: true,
  title: true,
  completed: true,
  expiresAt: true,
  tags: {
    select: {
      ...TAGS_SELECT,
      todos: false,
    },
  },
  subTasks: {
    select: SUBTASKS_SELECT,
  },
}

export const LISTS_SELECT: Prisma.TodoListSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  icon: true,
  title: true,
  protected: true,
  todos: {
    select: TODOS_SELECT,
  },
}

export const PROFILE_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  displayUsername: true,
  sessions: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      userAgent: true,
      ipAddress: true,
    },
  },
}
