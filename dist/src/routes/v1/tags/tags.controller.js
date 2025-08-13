import { getPrisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/index.js";
import { TAGS_SELECT } from "@/lib/constants.js";
const prisma = getPrisma();
export async function getSearchTag(c, queryParams) {
    const { query, limit, offset } = queryParams;
    const { id: userId } = c.get("user");
    try {
        const foundTags = await prisma.tag.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                userId,
            },
            skip: offset,
            take: limit,
            select: TAGS_SELECT,
        });
        return c.json(foundTags);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(`An error occurred while searching for tags. (${error.message})`, 500);
        }
        c.text("An error occurred while searching for tags", 500);
    }
}
export async function getTags(c) {
    const { id: userId } = c.get("user");
    try {
        const tags = await prisma.tag.findMany({
            where: {
                userId,
            },
            select: TAGS_SELECT,
        });
        return c.json(tags);
    }
    catch (error) {
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            c.text(error.message, 500);
        }
        return c.text("An unknown error occurred", 500);
    }
}
export async function getTagById(c, id) {
    const { id: userId } = c.get("user");
    try {
        const foundTag = await prisma.tag.findFirst({
            where: {
                id,
                userId,
            },
            select: TAGS_SELECT,
        });
        if (!foundTag) {
            return c.text("Tag not found", 404);
        }
        return c.json(foundTag);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ||
            error instanceof Error) {
            return c.text(error.message, 500);
        }
        return c.text("An error occurred while geting the todo.", 500);
    }
}
export async function createTag(c, data, todoId) {
    const { id: userId } = c.get("user");
    try {
        const createdTag = await prisma.tag.create({
            data: {
                ...data,
                ...(todoId
                    ? {
                        todos: {
                            connect: {
                                id: todoId,
                            },
                        },
                    }
                    : {}),
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            select: TAGS_SELECT,
        });
        return c.json(createdTag);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error ||
            error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.text(error.message, 500);
        }
        c.text("An unknown error occurred while creating the tag", 500);
    }
}
export async function updateTag(c, data, id) {
    const { id: userId } = c.get("user");
    try {
        const updatedTag = await prisma.tag.update({
            where: {
                id,
                userId,
            },
            data,
            select: TAGS_SELECT,
        });
        return c.json(updatedTag);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Tag not found.", 404);
            }
            return c.text(`An error occurred while updating the tag: ${error.message}`, 500);
        }
        return c.text("An error occurred while updating the tag.", 500);
    }
}
export async function deleteTag(c, id) {
    const { id: userId } = c.get("user");
    try {
        await prisma.tag.delete({
            where: {
                id,
                userId,
            },
        });
        return c.json({ message: "Tag has deleted successfully" });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return c.text("Tag not found.", 404);
            }
            return c.text(`An error occured while deleting the tag: ${error.message}`, 500);
        }
        return c.text("An error occurred while deleting the tag.", 500);
    }
}
