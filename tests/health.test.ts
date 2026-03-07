import request from "supertest";
import app from "../src/app.js";

describe("GET /health", () => {
    it("must success if the server is ok", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
    });
});