import { prisma } from "../src/lib/prisma.js";
import { env } from "../src/config/env.js";
import bcrypt from "bcrypt";
import { ADMIN_ID } from "./test.config.js";

beforeAll(async () => {
    try {
        const password_hash = await bcrypt.hash(env.ADMIN.pw, 1);

        await prisma.user.upsert({
            where: { email: env.ADMIN.email },
            update: {},
            create: {
                user_id: ADMIN_ID,
                username: env.ADMIN.email,
                email: env.ADMIN.email,
                password_hash,
                role: "ADMIN",
            },
        });
    } catch (error) {
        // Jika kena race condition (P2002), abaikan karena admin sudah ada
        if (error.code !== "P2002") throw error;
    }
});

beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    await prisma.user.deleteMany({
        where: { user_id: { not: ADMIN_ID } },
    });
});
