export const FAKE_TODO = {
  id: "12345",
  title: "Test Todo",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day later
  subTasks: [],
  tags: [],
};

const FAKE_LIST = {
  id: "123",
  title: "Inbox",
  icon: "Inbox",
  createdAt: new Date(),
  updatedAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  todos: [FAKE_TODO],
  protected: false,
};

const prismaMethods = ["create", "delete", "update", "findUnique", "findFirst"];

const todo = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_TODO)])
);

const todoList = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_LIST)])
);

export const mockPrisma = {
  getPrisma: () => ({
    todo,
    todoList,
  }),
};
