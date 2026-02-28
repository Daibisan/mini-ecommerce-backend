import bcrypt from "bcrypt";
import { env } from "../src/config/env.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
    const password_hash = await bcrypt.hash(env.ADMIN.pw, 11);

    try {
        // admin exist? do nothing, else? insert admin
        await prisma.user.upsert({
            update: {},
            create: {
                username: env.ADMIN.email,
                email: env.ADMIN.email,
                password_hash,
                role: "ADMIN",
            },
            where: { email: env.ADMIN.email },
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    console.log("✅ Seed database sukses: Akun Admin dibuat.");
}
main();
