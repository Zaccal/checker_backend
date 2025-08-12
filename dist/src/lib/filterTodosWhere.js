export const filterTodosWhere = (filter, listId, userId) => {
    const { completed, withDeadline, onlyExpired, createdFrom, createdTo, tagIds, } = filter;
    const where = {
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
