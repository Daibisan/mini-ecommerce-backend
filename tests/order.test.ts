import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { getAdminToken, seed } from "./test.util.js";
import { createToken } from "../src/lib/jwt.js";
import { OrderStatus } from "../src/generated/prisma/enums.js";

// Mock Midtrans agar tidak nembak API asli
vi.mock("../src/lib/midtrans.js", () => ({
    snap: {
        createTransaction: vi.fn().mockResolvedValue({
            token: "mock-token-123",
            redirect_url: "https://mock-midtrans.com/pay",
        }),
    },
}));

let userToken: string;
let userId: string;
let dummyOrderId: string;

beforeEach(async () => {
    // 1. Setup User
    const user = await prisma.user.create({
        data: {
            username: seed.username(),
            email: seed.email(),
            password_hash: "dummy",
            role: "USER",
        },
    });
    userId = user.user_id;
    userToken = createToken(userId, user.role);

    // 2. Setup Category & Product
    const category = await prisma.category.create({
        data: { name: seed.categoryName() },
    });
    const product = await prisma.product.create({
        data: {
            name: seed.productName(),
            price: 10000,
            stock: 50,
            category_id: category.category_id,
        },
    });

    // 3. Setup Cart & Items untuk test Checkout
    const cart = await prisma.cart.create({
        data: { user_id: userId },
    });
    await prisma.cartItem.create({
        data: {
            cart_id: cart.cart_id,
            product_id: product.product_id,
            quantity: 2,
        },
    });

    // 4. Setup Dummy Order untuk test GET & Webhook
    const order = await prisma.order.create({
        data: {
            user_id: userId,
            total_price: 20000,
            shipping_address: "Jl. Testing No. 1",
            status: "PENDING",
        },
    });
    dummyOrderId = order.order_id;
});

describe("POST /api/orders", () => {
    it("success: create new order from cart", async () => {
        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ shipping_address: "Jl. Checkout Sukses" });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.payment_token).toBe("mock-token-123");

        // Pastikan cart kosong setelah checkout
        const remainingCartItems = await prisma.cartItem.count({
            where: { cart: { user_id: userId } },
        });
        expect(remainingCartItems).toBe(0);
    });

    it("error: empty payload", async () => {
        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({});

        expect(response.status).toBe(400);
    });
});

describe("GET /api/orders", () => {
    it("success: return array of user orders", async () => {
        const response = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});

describe("GET /api/orders/:id", () => {
    it("success: return single order detail", async () => {
        const response = await request(app)
            .get(`/api/orders/${dummyOrderId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.order_id).toBe(dummyOrderId);
    });

    it("error: order not found", async () => {
        const response = await request(app)
            .get("/api/orders/invalid-uuid-123")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(404);
    });
});

describe("PATCH /api/orders/:id/status", () => {
    it("success: admin updates order status", async () => {
        const adminToken = getAdminToken();
        const response = await request(app)
            .patch(`/api/orders/${dummyOrderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: OrderStatus.SHIPPED, tracking_number: "RESI-123" });

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe(OrderStatus.SHIPPED);
        expect(response.body.data.tracking_number).toBe("RESI-123");
    });

    it("error: invalid status value", async () => {
        const adminToken = getAdminToken();
        const response = await request(app)
            .patch(`/api/orders/${dummyOrderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "STATUS_NGARANG" });

        expect(response.status).toBe(400);
    });
});

describe("POST /api/orders/webhook", () => {
    it("success: update status to PAID on settlement", async () => {
        const statusCode = "200";
        const grossAmount = "20000.00";
        const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

        // Generate signature yang valid
        const hashData = `${dummyOrderId}${statusCode}${grossAmount}${serverKey}`;
        const signatureKey = crypto.createHash("sha512").update(hashData).digest("hex");

        const response = await request(app)
            .post("/api/orders/webhook")
            .send({
                order_id: dummyOrderId,
                status_code: statusCode,
                gross_amount: grossAmount,
                signature_key: signatureKey,
                transaction_status: "settlement",
                fraud_status: "accept",
            });

        expect(response.status).toBe(200);

        // Verifikasi perubahan di database
        const updatedOrder = await prisma.order.findUnique({
            where: { order_id: dummyOrderId },
        });
        expect(updatedOrder?.status).toBe(OrderStatus.PAID);
    });

    it("error: invalid signature key", async () => {
        const response = await request(app)
            .post("/api/orders/webhook")
            .send({
                order_id: dummyOrderId,
                status_code: "200",
                gross_amount: "20000.00",
                signature_key: "signature-bodong",
                transaction_status: "settlement",
            });

        expect(response.status).toBe(400); // Bad Request / Invalid Webhook
    });
});