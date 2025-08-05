export function expectHasProperties(obj, keys) {
    keys.forEach((key) => {
        expect(obj).toHaveProperty(key);
    });
}
export const expectedKeysTodo = [
    "id",
    "title",
    "completed",
    "expiresAt",
    "tags",
    "subTasks",
    "createdAt",
    "updatedAt",
];
export const expectedKeysLists = [
    "id",
    "title",
    "updatedAt",
    "createdAt",
    "todos",
    "icon",
];
export const expectedKeysTags = [
    "id",
    "name",
    "updatedAt",
    "createdAt",
    "todos",
    "color",
];
export const expectedKeysSubtask = [
    "id",
    "createdAt",
    "updatedAt",
    "title",
    "completed",
    "todoId",
];
export const expectedProfileKeys = [
    "id",
    "name",
    "email",
    "image",
    "createdAt",
    "updatedAt",
    "displayUsername",
    "sessions",
];
export const expectedSessionKeys = [
    "id",
    "createdAt",
    "updatedAt",
    "userAgent",
    "ipAddress",
];
