import { prisma } from "../src/lib/prisma.js";
import { env } from "../src/config/env.js";
import bcrypt from "bcrypt";
import { ADMIN_ID } from "./test.config.js";

beforeAll(async () => {
    // Add admin acc
    const password_hash = await bcrypt.hash(env.ADMIN.pw, 11);
    await prisma.user.upsert({
        update: {},
        create: {
            user_id: ADMIN_ID,
            username: env.ADMIN.email,
            email: env.ADMIN.email,
            password_hash,
            role: "ADMIN",
        },
        where: { email: env.ADMIN.email },
    });
})

beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
});
