import { getPrisma } from '../../../config/prisma.js';
import { Prisma } from '@/generated/prisma/index.js';
import { LISTS_SELECT, TODOS_SELECT } from '../../../lib/constants.js';
import { filterTodosWhere } from '../../../lib/filterTodosWhere.js';
export async function searchTasksList(c, queryParams) {
    const userId = c.get('user').id;
    const { query, limit, offset } = queryParams;
    try {
        const foundLists = await getPrisma().todoList.findMany({
            where: {
                userId,
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            skip: offset,
            take: limit,
            select: LISTS_SELECT,
        });
        return c.json(foundLists);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while searching the todo lists. (${error.message})`, 500);
        }
    }
}
export async function getTaskLists(c) {
    const { id } = c.get('user');
    try {
        const lists = await getPrisma().todoList.findMany({
            where: {
                userId: id,
                protected: false,
            },
            select: LISTS_SELECT,
            orderBy: {
                createdAt: 'asc',
            },
        });
        return c.json(lists);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while getting the todo list. (${error.message})`, 500);
        }
    }
}
export async function getTaskListsProtected(c) {
    const { id: userId } = c.get('user');
    try {
        const lists = await getPrisma().todoList.findMany({
            where: {
                userId,
                protected: true,
            },
            select: {
                ...LISTS_SELECT,
                protected: true,
            },
        });
        return c.json(lists);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while getting the protected todo lists. (${error.message})`, 500);
        }
    }
}
export async function getTodosByListId(c, listId, queryParams) {
    const { id: userId } = c.get('user');
    const { sortBy, sortOrder, ...filter } = queryParams;
    const where = filterTodosWhere(filter, listId, userId);
    try {
        const todos = await getPrisma().todo.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: TODOS_SELECT,
        });
        return c.json(todos);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while getting the todos. (${error.message})`, 500);
        }
    }
}
export async function getListById(c, id) {
    const { id: userId } = c.get('user');
    try {
        const foundList = await getPrisma().todoList.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                ...LISTS_SELECT,
                todos: {
                    select: TODOS_SELECT,
                },
            },
        });
        if (!foundList) {
            return await c.notFound();
        }
        return c.json(foundList);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(`An error occurred while getting the todo list. (${error.message})`, 500);
        }
        return c.text('An error occurred while getting the todo list.', 500);
    }
}
export async function createList(c, data) {
    const { icon, title } = data;
    const { id: userId } = c.get('user');
    try {
        const createdList = await getPrisma().todoList.create({
            data: {
                title,
                icon,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            select: LISTS_SELECT,
        });
        return c.json(createdList);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while creating the todo list. (${error.message})`, 500);
        }
    }
}
export async function updateList(c, id, data) {
    const { icon, title } = data;
    const { id: userId } = c.get('user');
    try {
        const updatedList = await getPrisma().todoList.update({
            where: {
                id,
                userId,
            },
            data: {
                title,
                icon,
            },
            select: LISTS_SELECT,
        });
        return c.json(updatedList);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return c.text('Todo list not found.', 404);
            }
            return c.text(`An error occurred while updating the todo list: ${error.message}`, 500);
        }
        return c.text('An error occurred while updating the todo list.', 500);
    }
}
export async function deleteList(c, id) {
    const { id: userId } = c.get('user');
    try {
        await getPrisma().todoList.delete({
            where: {
                id,
                userId,
            },
        });
        return c.json({ message: 'List has deleted successfully' });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return c.text('Todo list not found.', 404);
            }
            return c.text(`An error occurred while deleting the todo list. (${error.message})`, 500);
        }
        return c.text('An error occurred while deleting the todo list.', 500);
    }
}
