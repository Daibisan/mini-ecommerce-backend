import { Request, Response } from "express";
import { healthService } from "./health.service.js";

export const getHealth = async (_req: Request, res: Response) => {
    const health = await healthService.getHealthStatus();

    const response = {
        status: health.isHealthy ? "ok" : "error",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
            database: {
                status: health.dbStatus,
                latency_ms: health.dbLatencyMs,
            },
        },
    };

    res.status(health.isHealthy ? 200 : 503).json(response);
};
