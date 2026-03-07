import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken } from "./test.util.js";

describe("Endpoint: Categories", () => {
    describe("POST /api/categories", () => {
        it("must success if payload valid and user is admin", async () => {
            const payload = { name: "Elektronik" };
            const adminToken = getAdminToken();

            const response = await request(app)
                .post("/api/categories")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe("Elektronik");
        });

        it("must error if payload is empty", async () => {
            const adminToken = getAdminToken();
            const response = await request(app)
                .post("/api/categories")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(response.status).toBe(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe("Category's name must be filled");
        });

        it("must error if typeof category's name is number", async () => {
            const payload = { name: 1 };
            const adminToken = getAdminToken();

            const response = await request(app)
                .post("/api/categories")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(
                "Category's name should be a string",
            );
        });

        it("must error if category's name contains only number", async () => {
            const payload = { name: "1" };
            const adminToken = getAdminToken();

            const response = await request(app)
                .post("/api/categories")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(
                "Category name can not only number",
            );
        });

        it("must error if category's name already exists", async () => {
            const payload = { name: "Test" };
            const adminToken = getAdminToken();

            await prisma.category.create({ data: payload });

            const response = await request(app)
                .post("/api/categories")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(409);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe(
                "Category already exists",
            );
        });
    });
});
