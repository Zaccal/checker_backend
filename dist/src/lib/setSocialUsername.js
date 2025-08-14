import { getPrisma } from '../config/prisma.js';
import { Prisma } from '@/generated/prisma/index.js';
export async function setSocialUsername(id, name) {
    try {
        await getPrisma().user.update({
            where: {
                id,
            },
            data: {
                username: name,
                displayUsername: name,
            },
        });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new Error(error.message);
        }
        return new Error("Couldn't set username");
    }
}
