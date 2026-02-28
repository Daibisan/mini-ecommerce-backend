import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";
import { Role } from "../../generated/prisma/enums.js";

const createCategory = async (name: string) => {
    // duplicate category's name?
    const nameExists = await prisma.category.findUnique({
        where: { name },
    });
    if (nameExists) {
        throw new AppError("Category already exists", 409);
    }

    const newCategory = await prisma.category.create({
        data: { name },
    });

    return newCategory;
};

export const categoryService = { createCategory }