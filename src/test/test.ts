import { prisma } from "../lib/prisma.js";

async function main() {
    // const user = await prisma.user.create({
    //     data: {
    //         username: "admin",
    //         email: "admin@mail.com",
    //         password_hash: "hashed123",
    //         role: "ADMIN",
    //     },
    // });

    // console.log(user);

    // // test get user
    // const user = await prisma.user.findMany();
    // console.log(user);
    
    // test create category
    const category = await prisma.category.create({data: { name: "drink"}});
    console.log(category);


    
    prisma.$disconnect();
}

main();


// app.use(requireAuth, authorize("USER"));
// app.get("/test/requireAuth", (req, res) => {
//     res.status(200).json({ message: "ok" });
// });