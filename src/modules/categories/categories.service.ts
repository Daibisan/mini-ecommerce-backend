import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";

// PUBLIC
const getAllCategories = async () => {
    return await prisma.category.findMany();
};

const getCategory = async (id: string) => {
    return await prisma.category.findUnique({ where: { category_id: id } });
};

// ADMIN
const createCategory = async (name: string) => {
    // duplicate category's name (case-sensitive)?
    const nameExists = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
    if (nameExists) throw new AppError("Category already exists", 409);

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
    const nameExists = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
    if (nameExists && nameExists.category_id !== id)
        throw new AppError("Category's name already exists", 409);

    const updatedCategory = await prisma.category.update({
        where: { category_id: id },
        data: { name },
    });

    return updatedCategory;
};

const deleteCategory = async (id: string) => {
    // isExist?
    const exists = await prisma.category.findUnique({
        where: { category_id: id },
    });
    if (!exists) {
        throw new AppError("Category not found", 404);
    }

    const deletedCategory = await prisma.category.delete({
        where: { category_id: id },
    });

    return deletedCategory;
};

export const categoryService = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
};
