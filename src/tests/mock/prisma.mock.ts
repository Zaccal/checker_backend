export const FAKE_TODO = {
  id: "12345",
  title: "Test Todo",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day later
  subTasks: [{}, {}],
  tags: [{}, {}, {}],
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

const FAKE_TAG = {
  name: "Tage",
  color: "blue",
  createdAt: new Date(),
  id: "123",
  updatedAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  todos: [FAKE_TODO],
};

const FAKE_SUBTASK = {
  id: "subtask-123",
  title: "Test Subtask",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  todoId: "12345",
};

const FAKE_USER = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  image: "https://example.com/avatar.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
  displayUsername: "testuser",
  sessions: [
    {
      id: "session-123",
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: "Mozilla/5.0 (Test Browser)",
      ipAddress: "127.0.0.1",
    },
  ],
};

const prismaMethods = ["create", "delete", "update", "findUnique", "findFirst"];

const todo = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_TODO)])
);

const todoList = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_LIST)])
);

const tag = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_TAG)])
);

const subTask = Object.fromEntries(
  prismaMethods.map((method) => [
    method,
    vi.fn().mockResolvedValue(FAKE_SUBTASK),
  ])
);

const user = Object.fromEntries(
  prismaMethods.map((method) => [method, vi.fn().mockResolvedValue(FAKE_USER)])
);

export const mockPrisma = {
  getPrisma: () => ({
    todo,
    todoList,
    tag,
    subTask,
    user,
  }),
};
