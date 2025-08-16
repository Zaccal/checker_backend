import { getPrisma } from '../config/prisma.js';
async function protectLists(c, next) {
    const { id } = c.req.param();
    if (!id) {
        return next();
    }
    if (c.req.method === 'GET') {
        return next();
    }
    const list = await getPrisma().todoList.findUnique({
        where: {
            id,
        },
    });
    if (!list?.protected) {
        return next();
    }
    throw new Error('It is protected list, impossible to modify it');
}
export default protectLists;
