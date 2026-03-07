import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken } from "./test.util.js";

describe("POST /api/categories", () => {
    it("success: payload valid & isAdmin", async () => {
        const adminToken = getAdminToken();
        const payload = { name: "Elektronik" };

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe("Elektronik");
    });

    it("error: empty payload", async () => {
        const adminToken = getAdminToken();
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({});

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Category's name must be filled");
    });

    it("error: typeof name is number", async () => {
        const adminToken = getAdminToken();
        const payload = { name: 1 };

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Category's name should be a string");
    });

    it("error: name contains only number", async () => {
        const adminToken = getAdminToken();
        const payload = { name: "1" };

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Category name can not only number");
    });

    it("error: name already exists", async () => {
        const adminToken = getAdminToken();
        const payload = { name: "Test" };

        await prisma.category.create({ data: payload });

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(409);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Category already exists");
    });
});

describe("PATCH /api/categories/:id", () => {
    it("success: payload, id valid & isAdmin", async () => {
        const targetedCategory = await prisma.category.create({
            data: { name: "Test" },
        });

        const id = targetedCategory.category_id;
        const adminToken = getAdminToken();
        const payload = { name: "Test2" };

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: empty payload", async () => {
        const targetedCategory = await prisma.category.create({
            data: { name: "Test" },
        });

        const id = targetedCategory.category_id;
        const adminToken = getAdminToken();
        const payload = {};

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: typeof name is number", async () => {
        const targetedCategory = await prisma.category.create({
            data: { name: "Test" },
        });

        const id = targetedCategory.category_id;
        const adminToken = getAdminToken();
        const payload = { name: 1 };

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: name contains only number", async () => {
        const targetedCategory = await prisma.category.create({
            data: { name: "Test" },
        });

        const id = targetedCategory.category_id;
        const adminToken = getAdminToken();
        const payload = { name: "1" };

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: category not found", async () => {
        const id = "test321";
        const adminToken = getAdminToken();
        const payload = { name: "Test" };

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("error: name already exists", async () => {
        await prisma.category.create({
            data: { name: "other test" },
        });
        const targetedCategory = await prisma.category.create({
            data: { name: "Test" },
        });

        const id = targetedCategory.category_id;
        const adminToken = getAdminToken();
        const payload = { name: "other test" };

        const response = await request(app)
            .patch(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });
});
