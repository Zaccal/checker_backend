import { getPrisma } from "./prisma.js";

export async function setSocialUsername(id: string, name: string) {
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
  } catch (error) {
    console.error("Failed to set social username:", error);
  }
}
