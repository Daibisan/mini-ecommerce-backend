import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ProductRequest } from "../../types/products.intereface.js";
import AppError from "../../utils/appError.util.js";

// PUBLIC
const getAllProducts = async () => {
    return await prisma.product.findMany();
};

const getProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { product_id: id },
    });
    if (!product) throw new AppError("Product not found", 404);

    return product;
};

// ADMIN
const createProduct = async (payload: ProductRequest) => {
    const newProduct = await prisma.product.create({
        data: { ...payload },
    });

    return newProduct;
};

const updateProduct = async (id: string, payload: Partial<ProductRequest>) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { product_id: id },
            data: { ...payload },
        });

        return updatedProduct;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // product not found
            if (error.code === "P2025") {
                throw new AppError("Product not found", 404);
            }
        }
        throw error;
    }
};

const deleteProduct = async (id: string) => {
    try {
        const deletedProduct = await prisma.product.delete({
            where: { product_id: id },
        });

        return deletedProduct;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // product not found
            if (error.code === "P2025") {
                throw new AppError("Product not found", 404);
            }
        }
        throw error;
    }
};

export const productService = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
};
