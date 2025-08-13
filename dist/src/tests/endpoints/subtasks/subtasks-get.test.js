import { app } from "@/app.js";
import { expectHasProperties, expectedKeysSubtask } from "@/lib/testHelper.js";
describe("GET Method - Subtasks", () => {
    describe("GET /search - Search subtasks", () => {
        test("GET search subtasks with valid query", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test subtask", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            const data = (await response.json());
            expect(response.status).toBe(200);
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
            if (data.length > 0) {
                expectHasProperties(data[0], expectedKeysSubtask);
            }
        });
        test("GET search subtasks with pagination", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test&offset=0&limit=5", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            const data = (await response.json());
            expect(response.status).toBe(200);
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeLessThanOrEqual(5);
            if (data.length > 0) {
                expectHasProperties(data[0], expectedKeysSubtask);
            }
        });
        test("GET search subtasks with invalid query format", async () => {
            const response = await app.request("/api/v1/subtasks/search?invalid=param", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(400);
            const data = await response.text();
            const dataJson = JSON.parse(data)[0];
            expect(dataJson.message).toBe("Invalid query format!");
        });
        test("GET search subtasks without authentication", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include",
            });
            expect(response.status).toBe(401);
        });
    });
    describe("GET /:id - Get subtasks by todoId or specific subtask", () => {
        test("GET subtasks by valid todoId", async () => {
            // Using a sample todoId - in real tests this would be from test data
            const response = await app.request("/api/v1/subtasks/cmda1n4ft0000puolhjo0o7s5", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(200);
            const data = (await response.json());
            expect(data).toBeDefined();
            expectHasProperties(data, expectedKeysSubtask);
        });
        test("GET specific subtask by valid subtaskId", async () => {
            // Using a sample subtaskId - in real tests this would be from test data
            const response = await app.request("/api/v1/subtasks/cmda1oqdd0001puoltds2nuef", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(200);
            const data = (await response.json());
            expect(data).toBeDefined();
            expectHasProperties(data, expectedKeysSubtask);
        });
        test("GET subtasks by non-existent todoId", async () => {
            const response = await app.request("/api/v1/subtasks/nonexistent-todo-id", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(404);
            expect(await response.text()).toBe("Subtasks not found for this todo.");
        });
        test("GET subtasks by non-existent subtaskId", async () => {
            const response = await app.request("/api/v1/subtasks/nonexistent-subtask-id", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(404);
            expect(await response.text()).toBe("Subtasks not found for this todo.");
        });
        test("GET subtasks with invalid ID format", async () => {
            const response = await app.request("/api/v1/subtasks/invalid-format", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(404);
            expect(await response.text()).toBe("Subtasks not found for this todo.");
        });
        test("GET subtasks without authentication", async () => {
            const response = await app.request("/api/v1/subtasks/cmda1n4ft0000puolhjo0o7s5", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include",
            });
            expect(response.status).toBe(401);
        });
        test("GET subtasks with empty ID parameter", async () => {
            const response = await app.request("/api/v1/subtasks/", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            // This should return 404 since no ID is provided
            expect(response.status).toBe(404);
        });
    });
    describe("Edge cases and error handling", () => {
        test("GET search with empty query", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            const data = (await response.json());
            expect(response.status).toBe(200);
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
        });
        test("GET search with special characters in query", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test!@#$%", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            const data = (await response.json());
            expect(response.status).toBe(200);
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
        });
        test("GET search with very long query", async () => {
            const longQuery = "a".repeat(1000);
            const response = await app.request(`/api/v1/subtasks/search?query=${longQuery}`, {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(400);
            const data = await response.text();
            const dataJson = JSON.parse(data)[0];
            expect(dataJson.message).toBe("Query must be less than 100 characters");
        });
        test("GET search with negative offset", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test&offset=-5&limit=10", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(400);
            const data = await response.text();
            const dataJson = JSON.parse(data)[0];
            expect(dataJson.message).toBe("Number must be greater than or equal to 0");
        });
        test("GET search with zero limit", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test&offset=0&limit=0", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(400);
            const data = await response.text();
            const dataJson = JSON.parse(data)[0];
            expect(dataJson.message).toBe("Limit must be greater than 0");
        });
        test("GET search with very large limit", async () => {
            const response = await app.request("/api/v1/subtasks/search?query=test&offset=0&limit=10000", {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            const data = (await response.json());
            expect(response.status).toBe(200);
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
        });
        test("GET with very long ID parameter", async () => {
            const longId = "a".repeat(1000);
            const response = await app.request(`/api/v1/subtasks/${longId}`, {
                method: "GET",
                headers: globalThis.authHeader,
                credentials: "include",
            });
            expect(response.status).toBe(404);
            expect(await response.text()).toBe("Subtasks not found for this todo.");
        });
    });
});
