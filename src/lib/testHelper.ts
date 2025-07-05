import type { TodoSelectedResponse } from "./types.js";

export function expectHasProperties<T = TodoSelectedResponse>(
  obj: T,
  keys: string[]
) {
  keys.forEach((key) => {
    expect(obj).toHaveProperty(key);
  });
}

export const expectedKeysTodo = [
  "id",
  "title",
  "completed",
  "expiresAt",
  "tags",
  "subTasks",
  "createdAt",
  "updatedAt",
];

export const expectedKeysLists = [
  "id",
  "title",
  "updatedAt",
  "createdAt",
  "todos",
  "icon",
];

export const expectedKeysTags = [
  "id",
  "name",
  "updatedAt",
  "createdAt",
  "todos",
  "color",
];
