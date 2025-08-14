import { getPrisma } from '../config/prisma.js';
async function setDefaultLists(id) {
    await getPrisma().todoList.createMany({
        data: [
            {
                title: 'Inbox',
                userId: id,
                protected: true,
                icon: 'inbox',
            },
            {
                title: 'Journal',
                userId: id,
                protected: true,
                icon: 'calendar-1',
            },
            {
                title: 'Work',
                userId: id,
                icon: 'briefcase',
            },
            {
                title: 'Personal',
                userId: id,
                icon: 'user',
            },
        ],
    });
}
export default setDefaultLists;
