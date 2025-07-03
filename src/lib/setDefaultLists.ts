import { getPrisma } from "./prisma.js";

async function setDefaultLists(id: string) {
  const data = getPrisma().todoList.findFirst({
    where: {
      userId: id,
      protected: true,
    },
  });

  if (data !== null) {
    return;
  }

  await getPrisma().todoList.createMany({
    data: [
      {
        title: "Inbox",
        userId: id,
        protected: true,
        icon: "inbox",
      },
      {
        title: "Journal",
        userId: id,
        protected: true,
        icon: "calendar-1",
      },
      {
        title: "Work",
        userId: id,
        icon: "briefcase",
      },
      {
        title: "Personal",
        userId: id,
        icon: "user",
      },
    ],
  });
}

export default setDefaultLists;
