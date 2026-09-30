import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("GET /health", () => {
    afterEach(() => {
        // Kembalikan semua mock ke implementasi asli setelah tiap test
        vi.restoreAllMocks();
    });

    it("success: return 200 and healthy status when database is connected", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
        expect(response.body.services.database.status).toBe("connected");
        expect(typeof response.body.services.database.latency_ms).toBe(
            "number",
        );
        expect(typeof response.body.uptime).toBe("number");
        expect(typeof response.body.timestamp).toBe("string");
    });

    it("error: return 503 and error status when database fails", async () => {
        // Simulasi database mati/putus koneksi
        vi.spyOn(prisma, "$queryRawUnsafe").mockRejectedValueOnce(
            new Error("Database connection timed out"),
        );

        const response = await request(app).get("/health");

        expect(response.status).toBe(503);
        expect(response.body.status).toBe("error");
        expect(response.body.services.database.status).toBe("disconnected");
        expect(typeof response.body.services.database.latency_ms).toBe(
            "number",
        );
    });
});
