import { app } from "../../../app.js";
import { expectedKeysLists, expectHasProperties, } from "../../../lib/testHelper.js";
describe("GET Method", () => {
    test("GET lists", async () => {
        const response = await app.request("/api/v1/lists", {
            method: "GET",
            headers: globalThis.authHeader,
            credentials: "include",
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
        }
    });
    test("GET protected lists", async () => {
        const response = await app.request("/api/v1/lists/protected", {
            method: "GET",
            headers: globalThis.authHeader,
            credentials: "include",
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0]).toHaveProperty("protected");
        }
    });
    test("GET by search", async () => {
        const response = await app.request("/api/v1/lists/search?query=inbox", {
            method: "GET",
            headers: globalThis.authHeader,
            credentials: "include",
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0].title.toLowerCase()).toContain("inbox");
        }
    });
    test("GET by id", async () => {
        const response = await app.request("/api/v1/lists/cmb3mgkmw00043p0u6ajrjjxm", {
            method: "GET",
            headers: globalThis.authHeader,
            credentials: "include",
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(false);
        if (data.length) {
            expectHasProperties(data[0], expectedKeysLists);
            expect(data[0].title).toMatch(/inbox/);
        }
    });
});
