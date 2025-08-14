import { getPrisma } from '@/config/prisma.js';
import { Prisma } from '@/generated/prisma/index.js';
import { TODOS_SELECT } from '@/lib/constants.js';
export async function getSearch(c, queryParam) {
    const { query, offset, limit } = queryParam;
    const userId = c.get('user').id;
    try {
        const foundTodos = await getPrisma().todo.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
                userId,
            },
            skip: offset,
            take: limit,
            select: TODOS_SELECT,
        });
        return c.json(foundTodos);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(`An error occurred while searching for todos. (${error.message})`, 500);
        }
    }
}
export async function getTodoById(c, id) {
    const user = c.get('user');
    try {
        const todos = await getPrisma().todo.findFirst({
            where: {
                userId: user.id,
                OR: [
                    {
                        todoListId: id,
                    },
                    { id: id },
                ],
            },
            select: TODOS_SELECT,
        });
        if (!todos) {
            return c.text('Todo not found.', 404);
        }
        return c.json(todos);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(error.message, 500);
        }
        return c.text('An error occurred while getting the todos.', 500);
    }
}
export async function createTodo(c, data) {
    const user = c.get('user');
    const { title, expiresAt, taskListId, tags, subtasks } = data;
    try {
        const tagConnections = [];
        const newTags = [];
        if (tags) {
            for (const tag of tags) {
                if (typeof tag === 'string') {
                    tagConnections.push({ id: tag });
                }
                else {
                    newTags.push(tag);
                }
            }
        }
        const newSubtasks = subtasks ?? [];
        const todo = await getPrisma().todo.create({
            data: {
                title,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                todoList: {
                    connect: {
                        id: taskListId,
                    },
                },
                tags: {
                    connect: tagConnections,
                    create: newTags.map(tag => ({
                        name: tag.name,
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    })),
                },
                subTasks: {
                    create: newSubtasks.map(subtask => ({
                        title: subtask.title,
                        completed: subtask.completed,
                    })),
                },
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            c.text(error.message, 500);
        }
        c.text('An error occurred while creating the todo.', 500);
    }
}
export async function deleteTodo(c, id) {
    const user = c.get('user');
    try {
        await getPrisma().todo.delete({
            where: {
                id,
                userId: user.id,
            },
        });
        return c.json({ message: 'Task has deleted successfully' });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return c.text('Todo not found.', 404);
            }
            return c.text(`An error occurred while deleting the todo: ${error.message}`, 500);
        }
        return c.text('An error occurred while geting the todo.', 500);
    }
}
export async function completeTodo(c, id, complited) {
    const prisma = getPrisma();
    const user = c.get('user');
    try {
        const todo = await prisma.todo.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                completed: complited,
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return c.text('Todo not found.', 404);
            }
            return c.text(`An error occurred while geting the todo: ${error.message}`, 500);
        }
        return c.text('An error occurred while geting the todo.', 500);
    }
}
export async function updateTodo(c, data, id) {
    const user = c.get('user');
    const { title, expiresAt, subtasks, tags } = data;
    const tagConnections = [];
    const newTags = [];
    const newSubtask = subtasks ?? [];
    if (tags) {
        for (const tag of tags) {
            if (typeof tag === 'string') {
                tagConnections.push({ id: tag });
            }
            else {
                newTags.push(tag);
            }
        }
    }
    try {
        const todo = await getPrisma().todo.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                title,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
                tags: {
                    set: [],
                    connect: tagConnections,
                    create: newTags.map(tag => ({
                        name: tag.name,
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    })),
                },
                subTasks: {
                    deleteMany: {},
                    create: newSubtask.map(subtask => ({
                        title: subtask.title,
                        completed: subtask.completed || false,
                    })),
                },
            },
            select: TODOS_SELECT,
        });
        return c.json(todo);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return c.text('Todo not found.', 404);
            }
            return c.text('An error occurred while geting the todo.', 500);
        }
    }
}
