// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin123", 10);
    prisma.user.create({
        data: {
            email: "admin@admin.com",
            name: "admin",
            role: "ADMIN",
            password,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.log(e);

        await prisma.$disconnect();
        process.exit(1);
    });
