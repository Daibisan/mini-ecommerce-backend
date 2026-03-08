import bcrypt from "bcrypt";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { seed } from "./test.util.js";

describe("POST /api/auth/register", () => {
    it("success: payload valid", async () => {
        const payload = {
            username: seed.username(),
            email: seed.email(),
            password: seed.password,
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    it("error: weak password", async () => {
        const payload = {
            username: seed.username(),
            email: seed.email(),
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
            username: seed.username(),
            email: "emailgmail.",
            password: seed.password,
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(400);
    });

    it("error: duplicate email", async () => {
        const email = seed.email();
        await prisma.user.create({
            data: {
                username: seed.username(),
                email: email,
                password_hash: "dummy_hash",
            },
        });

        const payload = {
            username: seed.username(),
            email: email,
            password: seed.password,
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(409);
    });

    it("error: duplicate username", async () => {
        const username = seed.username();
        await prisma.user.create({
            data: {
                username: username,
                email: seed.email(),
                password_hash: "dummy_hash",
            },
        });

        const payload = {
            username: username,
            email: seed.email(),
            password: seed.password,
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(payload);

        expect(response.status).toBe(409);
    });
});

describe("POST /api/auth/login", () => {
    it("success: login with username", async () => {
        const username = seed.username();
        const password_hash = await bcrypt.hash(seed.defaultUserPassword, 1);

        await prisma.user.create({
            data: {
                username: username,
                email: seed.email(),
                password_hash,
            },
        });

        const response = await request(app).post("/api/auth/login").send({
            identifier: username,
            password: seed.defaultUserPassword,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("success: login with email", async () => {
        const email = seed.email();
        const password_hash = await bcrypt.hash(seed.defaultUserPassword, 1);

        await prisma.user.create({
            data: {
                username: seed.username(),
                email: email,
                password_hash,
            },
        });

        const response = await request(app).post("/api/auth/login").send({
            identifier: email,
            password: seed.defaultUserPassword,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("error: identifier not found", async () => {
        const response = await request(app).post("/api/auth/login").send({
            identifier: seed.email(),
            password: seed.password,
        });

        expect(response.status).toBe(401);
    });

    it("error: invalid password", async () => {
        const email = seed.email();
        const password_hash = await bcrypt.hash(seed.defaultUserPassword, 1);

        await prisma.user.create({
            data: { username: seed.username(), email, password_hash },
        });

        const response = await request(app).post("/api/auth/login").send({
            identifier: email,
            password: "wrong_password",
        });

        expect(response.status).toBe(401);
    });
});
