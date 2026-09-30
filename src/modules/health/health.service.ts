import { prisma } from "../../lib/prisma.js";

export interface HealthCheckResult {
    isHealthy: boolean;
    dbStatus: "connected" | "disconnected";
    dbLatencyMs: number;
}

const checkDatabase = async (): Promise<{
    status: "connected" | "disconnected";
    latency: number;
}> => {
    const start = Date.now();
    try {
        await prisma.$queryRawUnsafe("SELECT 1");
        return { status: "connected", latency: Date.now() - start };
    } catch {
        return { status: "disconnected", latency: Date.now() - start };
    }
};

const getHealthStatus = async (): Promise<HealthCheckResult> => {
    const db = await checkDatabase();

    return {
        isHealthy: db.status === "connected",
        dbStatus: db.status,
        dbLatencyMs: db.latency,
    };
};

export const healthService = {
    getHealthStatus,
};
