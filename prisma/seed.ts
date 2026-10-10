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

        const dummyCaregory = await prisma.category.upsert({
            update: {},
            create: {
                name: "Wears",
            },
            where: { name: "Wears" },
        });

        const dummyProducts = Array.from({ length: 20 }).map((_, index) => ({
            name: `Sepatu Casual Seri #${index + 1}`,
            price: (index + 1) * 25000,
            stock: 10 + index,
            description: `Deskripsi lengkap untuk produk dummy ke-${index + 1}`,
            category_id: dummyCaregory.category_id,
        }));

        await prisma.product.createMany({
            data: dummyProducts,
        });

        console.log("Seeding 20 produk selesai!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    console.log("✅ Seed database sukses: Akun Admin dibuat.");
}
main();
