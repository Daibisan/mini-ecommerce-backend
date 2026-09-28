import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken, seed } from "./test.util.js";

describe("POST /api/categories", () => {
    it("success: payload valid & isAdmin", async () => {
        const name = seed.categoryName();
        const adminToken = getAdminToken();

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Category created!");
        expect(response.body.data.name).toBe(name.toLowerCase());
    });

    it("error: empty payload", async () => {
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "name" }),
            ]),
        );
    });

    it("error: typeof name is number", async () => {
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: 1 });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "name" }),
            ]),
        );
    });

    it("error: name contains only numbers (custom refine)", async () => {
        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: "12345" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "name",
                    message: "Category name can not only number",
                }),
            ]),
        );
    });

    it("error: name already exists", async () => {
        const name = seed.categoryName();
        await prisma.category.create({ data: { name: name.toLowerCase() } });

        const response = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Category already exists");
    });
});

describe("PATCH /api/categories/:id", () => {
    it("success: payload, id valid & isAdmin", async () => {
        const cat = await prisma.category.create({
            data: { name: seed.categoryName().toLowerCase() },
        });
        const newName = seed.categoryName();

        const response = await request(app)
            .patch(`/api/categories/${cat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: newName });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Category updated!");
    });

    it("error: category not found", async () => {
        const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await request(app)
            .patch(`/api/categories/${nonExistentId}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: seed.categoryName() });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Category not found");
    });

    it("error: name already exists", async () => {
        const existingName = seed.categoryName().toLowerCase();
        await prisma.category.create({ data: { name: existingName } });

        const targetCat = await prisma.category.create({
            data: { name: seed.categoryName().toLowerCase() },
        });

        const response = await request(app)
            .patch(`/api/categories/${targetCat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ name: existingName });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Category's name already exists");
    });
});

describe("DELETE /api/categories/:id", () => {
    it("success: id valid & isAdmin", async () => {
        const cat = await prisma.category.create({
            data: { name: seed.categoryName().toLowerCase() },
        });

        const response = await request(app)
            .delete(`/api/categories/${cat.category_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Category deleted!");
    });
});

describe("GET /api/categories", () => {
    it("success: return array of categories", async () => {
        await prisma.category.createMany({
            data: [
                { name: seed.categoryName().toLowerCase() },
                { name: seed.categoryName().toLowerCase() },
            ],
        });

        const response = await request(app)
            .get(`/api/categories`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });
});
