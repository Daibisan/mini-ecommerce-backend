import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";

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

const updateCategory = async (id: string, name: string) => {
    // isExist?
    const exists = await prisma.category.findUnique({
        where: { category_id: id },
    });
    if (!exists) {
        throw new AppError("Category not found", 404);
    }

    // duplicate category's name?
    const nameExists = await prisma.category.findUnique({
        where: { name },
    });
    if (nameExists) {
        throw new AppError("Category's name already exists", 409);
    }

    const updatedCategory = await prisma.category.update({
        where: { category_id: id },
        data: { name }
    });

    return updatedCategory;
};

export const categoryService = { createCategory, updateCategory }