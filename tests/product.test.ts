import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken, seed } from "./test.util.js";

let categoryId: string;
const nonExistentUuid = "123e4567-e89b-12d3-a456-426614174000";

beforeEach(async () => {
    const category = await prisma.category.create({
        data: { name: seed.categoryName().toLowerCase() },
    });
    categoryId = category.category_id;
});

describe("POST /api/products", () => {
    it("success: payload valid & isAdmin", async () => {
        const payload = {
            name: seed.productName(),
            description: "Test description",
            price: 10000,
            stock: 50,
            category_id: categoryId,
        };

        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe(payload.name);
        expect(response.body.data.category_id).toBe(categoryId);
    });

    it("error: empty payload", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "name" }),
                expect.objectContaining({ field: "price" }),
                expect.objectContaining({ field: "stock" }),
                expect.objectContaining({ field: "category_id" }),
            ]),
        );
    });

    it("error: typeof name is number", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({
                name: 123,
                description: "Desc",
                price: 10000,
                stock: 50,
                category_id: categoryId,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "name" }),
            ]),
        );
    });

    it("error: price should be a number", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({
                name: seed.productName(),
                description: "Desc",
                price: "10000",
                stock: 50,
                category_id: categoryId,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "price" }),
            ]),
        );
    });
});

describe("GET /api/products", () => {
    it("success: return array of products", async () => {
        await prisma.product.create({
            data: {
                name: seed.productName(),
                price: 15000,
                stock: 20,
                category_id: categoryId,
            },
        });

        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});

describe("GET /api/products/:id", () => {
    it("success: return single product", async () => {
        const product = await prisma.product.create({
            data: {
                name: seed.productName(),
                price: 15000,
                stock: 20,
                category_id: categoryId,
            },
        });

        const response = await request(app).get(
            `/api/products/${product.product_id}`,
        );
        expect(response.status).toBe(200);
        expect(response.body.data.product_id).toBe(product.product_id);
    });

    it("error: product not found", async () => {
        const response = await request(app).get(
            `/api/products/${nonExistentUuid}`,
        );
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Product not found");
    });
});

describe("PATCH /api/products/:id", () => {
    it("success: payload, id valid & isAdmin", async () => {
        const product = await prisma.product.create({
            data: {
                name: seed.productName(),
                price: 10000,
                stock: 10,
                category_id: categoryId,
            },
        });

        const response = await request(app)
            .patch(`/api/products/${product.product_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ price: 25000, stock: 15 });

        expect(response.status).toBe(200);
        expect(Number(response.body.data.price)).toBe(25000);
        expect(Number(response.body.data.stock)).toBe(15);
    });

    it("error: empty payload", async () => {
        const product = await prisma.product.create({
            data: {
                name: seed.productName(),
                price: 10000,
                stock: 10,
                category_id: categoryId,
            },
        });

        const response = await request(app)
            .patch(`/api/products/${product.product_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "root",
                    message: "New Product's data must be filled at least one",
                }),
            ]),
        );
    });

    it("error: product not found", async () => {
        const response = await request(app)
            .patch(`/api/products/${nonExistentUuid}`)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send({ price: 1000 });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Product not found");
    });
});

describe("DELETE /api/products/:id", () => {
    it("success: id valid & isAdmin", async () => {
        const product = await prisma.product.create({
            data: {
                name: seed.productName(),
                price: 10000,
                stock: 10,
                category_id: categoryId,
            },
        });

        const response = await request(app)
            .delete(`/api/products/${product.product_id}`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: product not found", async () => {
        const response = await request(app)
            .delete(`/api/products/${nonExistentUuid}`)
            .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Product not found");
    });
});
