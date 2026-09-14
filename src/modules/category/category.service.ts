import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";

// PUBLIC
const getAllCategories = async () => {
    return await prisma.category.findMany();
};

const getCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { category_id: id },
    });
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    return category;
};

// ADMIN
const createCategory = async (name: string) => {
    const normalizedName = name.toLowerCase().trim();

    try {
        const newCategory = await prisma.category.create({
            data: { name: normalizedName },
        });

        return newCategory;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // duplicate category
            if (error.code === "P2002") {
                throw new AppError("Category already exists", 409);
            }
        }
        throw error;
    }
};

const updateCategory = async (id: string, name: string) => {
    const normalizedName = name.toLowerCase().trim();

    try {
        const updatedCategory = await prisma.category.update({
            where: { category_id: id },
            data: { name: normalizedName },
        });

        return updatedCategory;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // duplicate category
            if (error.code === "P2002") {
                throw new AppError("Category's name already exists", 409);
            }
            // category not found
            if (error.code === "P2025") {
                throw new AppError("Category not found", 404);
            }
        }
        throw error;
    }
};

const deleteCategory = async (id: string) => {
    try {
        const deletedCategory = await prisma.category.delete({
            where: { category_id: id },
        });

        return deletedCategory;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // category not found
            if (error.code === "P2025") {
                throw new AppError("Category not found", 404);
            }
        }
        throw error;
    }
};

export const categoryService = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
};
