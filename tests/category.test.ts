import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken, seed } from "./test.util.js"; // Pakai seed

describe("POST /api/categories", () => {
    it("success: payload valid & isAdmin", async () => {
        const name = seed.categoryName();
        const adminToken = getAdminToken();

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name });

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe(name);
    });

    it("error: empty payload", async () => {
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category's name must be filled");
    });

    it("error: typeof name is number", async () => {
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: 1 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category's name should be a string");
    });

    it("error: name already exists", async () => {
        const name = seed.categoryName();
        await prisma.category.create({ data: { name } });

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name });

        expect(response.status).toBe(409);
    });
});

describe("PATCH /api/categories/:id", () => {
    it("success: payload, id valid & isAdmin", async () => {
        const cat = await prisma.category.create({
            data: { name: seed.categoryName() },
        });
        const newName = seed.categoryName();

        const response = await request(app)
            .patch(`/api/categories/${cat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: newName });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: category not found", async () => {
        const response = await request(app)
            .patch(`/api/categories/${seed.username()}`) // Pakai random string apa saja
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: seed.categoryName() });

        expect(response.status).toBe(404);
    });

    it("error: name already exists", async () => {
        const existingName = seed.categoryName();
        await prisma.category.create({ data: { name: existingName } });

        const targetCat = await prisma.category.create({
            data: { name: seed.categoryName() },
        });

        const response = await request(app)
            .patch(`/api/categories/${targetCat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: existingName });

        expect(response.status).toBe(409);
    });
});

describe("DELETE /api/categories/:id", () => {
    it("success: id valid & isAdmin", async () => {
        const cat = await prisma.category.create({
            data: { name: seed.categoryName() },
        });

        const response = await request(app)
            .delete(`/api/categories/${cat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});

describe("GET /api/categories", () => {
    it("success: return array of categories", async () => {
        await prisma.category.createMany({
            data: [
                { name: seed.categoryName() },
                { name: seed.categoryName() },
            ],
        });

        const response = await request(app)
            .get(`/api/categories`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
    });
});
