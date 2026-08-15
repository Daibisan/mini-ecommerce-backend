import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { seed } from "./test.util.js";
import { createToken } from "../src/lib/jwt.js";

let userToken: string;
let productId: string;
let categoryId: string;

beforeEach(async () => {
    const user = await prisma.user.create({
        data: {
            username: seed.username(),
            email: seed.email(),
            password_hash: "dummy",
            role: "USER",
        },
    });
    userToken = createToken(user.user_id, user.role);

    const category = await prisma.category.create({
        data: { name: seed.categoryName() },
    });
    categoryId = category.category_id;

    const product = await prisma.product.create({
        data: {
            name: seed.productName(),
            price: 15000,
            stock: 10,
            category_id: categoryId,
        },
    });
    productId = product.product_id;
});

describe("POST /api/cart/items", () => {
    it("success: payload valid", async () => {
        const response = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: productId,
                quantity: 2,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.quantity).toBe(2);
    });

    it("error: empty payload", async () => {
        const response = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Payload must be filled");
    });

    it("error: invalid type (quantity string)", async () => {
        const response = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: productId,
                quantity: "2",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Quantity type should be integer");
    });

    it("error: product not found", async () => {
        const response = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: "invalid-product-id",
                quantity: 1,
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Product not found");
    });

    it("error: quantity higher than stock", async () => {
        const response = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: productId,
                quantity: 999,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Quantity higher than the stock");
    });
});

describe("GET /api/cart", () => {
    it("success: return cart", async () => {
        // Pancing buat keranjang dulu dengan menambahkan item
        await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ product_id: productId, quantity: 1 });

        const response = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("items");
    });

    it("error: cart not found", async () => {
        // Test menggunakan user baru yang belum pernah membuat keranjang
        const newUser = await prisma.user.create({
            data: {
                username: seed.username(),
                email: seed.email(),
                password_hash: "dummy",
                role: "USER",
            },
        });
        const newUserToken = createToken(newUser.user_id, newUser.role);

        const response = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${newUserToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Cart not found");
    });
});

describe("PATCH /api/cart/items/:id", () => {
    it("success: payload valid", async () => {
        const addRes = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ product_id: productId, quantity: 1 });
        const cartItemId = addRes.body.data.cart_item_id;

        const response = await request(app)
            .patch(`/api/cart/items/${cartItemId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 3 });

        expect(response.status).toBe(200);
        expect(response.body.data.quantity).toBe(3);
    });

    it("error: invalid type (quantity string)", async () => {
        const addRes = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ product_id: productId, quantity: 1 });
        const cartItemId = addRes.body.data.cart_item_id;

        const response = await request(app)
            .patch(`/api/cart/items/${cartItemId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: "3" });

        expect(response.status).toBe(400);
    });

    it("error: quantity higher than stock", async () => {
        const addRes = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ product_id: productId, quantity: 1 });
        const cartItemId = addRes.body.data.cart_item_id;

        const response = await request(app)
            .patch(`/api/cart/items/${cartItemId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 999 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Quantity higher than the stock");
    });

    it("error: cart item not found", async () => {
        const response = await request(app)
            .patch("/api/cart/items/invalid-cart-item-id")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 2 });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("CartItem not found");
    });
});

describe("DELETE /api/cart/items/:id", () => {
    it("success: remove cart item", async () => {
        const addRes = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ product_id: productId, quantity: 1 });
        const cartItemId = addRes.body.data.cart_item_id;

        const response = await request(app)
            .delete(`/api/cart/items/${cartItemId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: cart item not found", async () => {
        const response = await request(app)
            .delete("/api/cart/items/invalid-cart-item-id")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(404);
    });
});

describe("DELETE /api/cart", () => {
    it("success: clear cart", async () => {
        const response = await request(app)
            .delete("/api/cart")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Cart cleared successfully");
    });
});
