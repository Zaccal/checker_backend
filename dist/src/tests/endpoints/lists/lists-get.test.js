import { app } from '@/app.js';
import { expectedKeysLists, expectHasProperties, expectedKeysTodo, } from '@/lib/testHelper.js';
describe('GET Method', () => {
    test('GET lists', async () => {
        const response = await app.request('/api/v1/lists', {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
        }
    });
    test('GET protected lists', async () => {
        const response = await app.request('/api/v1/lists/protected', {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0]).toHaveProperty('protected');
        }
    });
    test('GET by search', async () => {
        const response = await app.request('/api/v1/lists/search?query=inbox', {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0].title.toLowerCase()).toContain('inbox');
        }
    });
    test('GET by id', async () => {
        const response = await app.request('/api/v1/lists/cmb3mgkmw00043p0u6ajrjjxm', {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(false);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0].title).toMatch(/inbox/);
        }
    });
});
const listId = 'cmd7jaqr10002putxl7hgctyu'; // Replace with a valid test listId
describe('GET /api/v1/lists/:listId/todos (filter endpoint)', () => {
    test('Filter by completed', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?completed=true`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysTodo);
            data.forEach((todo) => {
                expect(todo.completed).toBe(true);
            });
        }
    });
    test('Filter by expired', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?onlyExpired=true`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        data.forEach(todo => {
            expect(typeof todo.expiresAt).toBe('string');
            const expiresAtDate = todo.expiresAt
                ? new Date(todo.expiresAt)
                : new Date();
            expect(expiresAtDate.getTime()).toBeLessThanOrEqual(Date.now());
        });
    });
    test('Filter by withDeadline', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?withDeadline=true`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        data.forEach(todo => {
            expect(typeof todo.expiresAt).toBe('string');
        });
    });
    test('Filter by withDeadline and onlyExpired', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?withDeadline=true&onlyExpired=true`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        data.forEach(todo => {
            expect(typeof todo.expiresAt).toBe('string');
            const expiresAtDate = todo.expiresAt
                ? new Date(todo.expiresAt)
                : new Date();
            expect(expiresAtDate.getTime()).toBeLessThanOrEqual(Date.now());
        });
    });
    test('Filter by tagIds', async () => {
        const tagId = 'cmdbk8qlh0001pujwp7c5i76j,cmdbk7n6u0000pujwjkm9i5g8'; // Replace with a valid tagId
        const response = await app.request(`/api/v1/lists/${listId}/todos?tagIds=${tagId}`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        const tagIds = tagId.split(',');
        if (data.length) {
            data.forEach(todo => {
                const todoTagIds = todo.tags.map(tag => tag.id);
                const hasAtLeastOne = tagIds.some(id => todoTagIds.includes(id));
                expect(hasAtLeastOne).toBe(true);
            });
        }
    });
    test('Filter by created date range', async () => {
        const from = new Date('2025-06-01T00:00:00.000Z').toISOString();
        const to = new Date('2025-07-15T23:59:59.999Z').toISOString();
        const response = await app.request(`/api/v1/lists/${listId}/todos?createdFrom=${from}&createdTo=${to}`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            data.forEach(todo => {
                const createdAtDate = new Date(todo.createdAt).toISOString();
                expect(createdAtDate >= from).toBe(true);
                expect(createdAtDate <= to).toBe(true);
            });
        }
    });
    test('Sort by title desc', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?sortBy=title&sortOrder=desc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 1) {
            for (let i = 1; i < data.length; i++) {
                expect(data[i - 1].title.localeCompare(data[i].title)).toBeGreaterThanOrEqual(0);
            }
        }
    });
    test('Sort by title asc', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?sortBy=title&sortOrder=asc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 1) {
            for (let i = 1; i < data.length; i++) {
                expect(data[i - 1].title.localeCompare(data[i].title)).toBeLessThanOrEqual(0);
            }
        }
    });
    test('Sort by createAt/updatedAt desc', async () => {
        const responseCreated = await app.request(`/api/v1/lists/${listId}/todos?sortBy=createdAt&sortOrder=desc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const responseUpadeted = await app.request(`/api/v1/lists/${listId}/todos?sortBy=updatedAt&sortOrder=desc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        // testing by created
        const dataCreated = (await responseCreated.json());
        expect(responseCreated.status).toBe(200);
        expect(Array.isArray(dataCreated)).toBe(true);
        if (dataCreated.length > 1) {
            for (let i = 1; i < dataCreated.length; i++) {
                const prev = new Date(dataCreated[i - 1].createdAt).getTime();
                const curr = new Date(dataCreated[i].createdAt).getTime();
                expect(prev).toBeGreaterThanOrEqual(curr);
            }
        }
        // testing by updated
        const dataUpdated = (await responseUpadeted.json());
        expect(responseUpadeted.status).toBe(200);
        expect(Array.isArray(dataUpdated)).toBe(true);
        if (dataUpdated.length > 1) {
            for (let i = 1; i < dataUpdated.length; i++) {
                const prev = new Date(dataUpdated[i - 1].updatedAt).getTime();
                const curr = new Date(dataUpdated[i].updatedAt).getTime();
                expect(prev).toBeGreaterThanOrEqual(curr);
            }
        }
    });
    test('Sort by createAt/updatedAt asc', async () => {
        const responseCreated = await app.request(`/api/v1/lists/${listId}/todos?sortBy=createdAt&sortOrder=asc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        const responseUpadeted = await app.request(`/api/v1/lists/${listId}/todos?sortBy=updatedAt&sortOrder=asc`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        // testing createAt
        const dataCreated = (await responseCreated.json());
        expect(responseCreated.status).toBe(200);
        expect(Array.isArray(dataCreated)).toBe(true);
        if (dataCreated.length > 1) {
            for (let i = 1; i < dataCreated.length; i++) {
                const prev = new Date(dataCreated[i - 1].createdAt).getTime();
                const curr = new Date(dataCreated[i].createdAt).getTime();
                expect(prev).toBeLessThanOrEqual(curr);
            }
        }
        // testing updatedAt
        const dataUpdated = (await responseUpadeted.json());
        expect(responseUpadeted.status).toBe(200);
        expect(Array.isArray(dataUpdated)).toBe(true);
        if (dataUpdated.length > 1) {
            for (let i = 1; i < dataUpdated.length; i++) {
                const prev = new Date(dataUpdated[i - 1].updatedAt).getTime();
                const curr = new Date(dataUpdated[i].updatedAt).getTime();
                expect(prev <= curr).toBe(true);
            }
        }
    });
    test('No results for impossible filter', async () => {
        const response = await app.request(`/api/v1/lists/${listId}/todos?completed=true&completed=false`, {
            method: 'GET',
            headers: globalThis.authHeader,
            credentials: 'include',
        });
        expect(response.status).toBe(400);
    });
});
