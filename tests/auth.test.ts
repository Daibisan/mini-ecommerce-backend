import bcrypt from "bcrypt";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("POST /api/auth/register", () => {
    it("success: payload valid", async () => {
        const payload = {
            username: "name",
            email: "email@gmail.com",
            password: "12345678Password.!",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    it("error: weak password", async () => {
        const payload = {
            username: "name",
            email: "email@gmail.com",
            password: "1234",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: not an email", async () => {
        const payload = {
            username: "name",
            email: "emailgmail.",
            password: "1234",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: duplicate email", async () => {
        await prisma.user.create({
            data: {
                username: "name",
                email: "email@gmail.com",
                password_hash: "123456",
            },
        });

        const payload = {
            username: "name2",
            email: "email@gmail.com",
            password: "123456789Password.!",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });

    it("error: duplicate username", async () => {
        await prisma.user.create({
            data: { username: "name", email: "email", password_hash: "123456" },
        });

        const payload = {
            username: "name",
            email: "email@gmail.com",
            password: "123456789Password.!",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });
});

describe("POST /api/auth/login", () => {
    it("success: login with username", async () => {
        const password_hash = await bcrypt.hash("12345678User.!", 11);
        await prisma.user.create({
            data: { username: "user1", email: "user@gmail.com", password_hash },
        });

        const payload = {
            identifier: "user1",
            password: "12345678User.!",
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("success: login with email", async () => {
        const password_hash = await bcrypt.hash("12345678User.!", 11);
        await prisma.user.create({
            data: { username: "user1", email: "user@gmail.com", password_hash },
        });

        const payload = {
            identifier: "user@gmail.com",
            password: "12345678User.!",
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: empty payload", async () => {
        const payload = {
            identifier: "user@gmail.com",
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("error: username/email not found", async () => {
        const payload = {
            identifier: "test",
            password: "123456789Password.!",
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(payload);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("error: invalid password", async () => {
        const password_hash = await bcrypt.hash("12345678User.!", 11);
        await prisma.user.create({
            data: { username: "user1", email: "user@gmail.com", password_hash },
        });

        const payload = {
            identifier: "user@gmail.com",
            password: "12345678User",
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(payload);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
