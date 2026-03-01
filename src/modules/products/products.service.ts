import { prisma } from "../../lib/prisma.js";
import { ProductRequest } from "../../types/products.intereface.js";
import AppError from "../../utils/appError.util.js";

// PUBLIC
const getAllProducts = async () => {
    return await prisma.product.findMany();
};

const getProduct = async (id: string) => {
    const product = await prisma.product.findUnique({ where: { product_id: id } });
    if (!product) throw new AppError("Product not found", 404);

    return product;
};

// ADMIN
const createProduct = async (payload: ProductRequest) => {
    // duplicate product's name?
    const nameExists = await prisma.product.findUnique({
        where: { name: payload.name },
    });
    if (nameExists) {
        throw new AppError("Product already exists", 409);
    }

    const newProduct = await prisma.product.create({
        data: { ...payload },
    });

    return newProduct;
};

const updateProduct = async (id: string, payload: Partial<ProductRequest>) => {
    // isExist?
    const exists = await prisma.product.findUnique({
        where: { product_id: id },
    });
    if (!exists) {
        throw new AppError("Product not found", 404);
    }

    // duplicate product's name?
    if (payload.name) {
        const nameExists = await prisma.product.findUnique({
            where: { name: payload.name },
        });
        if (nameExists && nameExists.product_id !== id) {
            throw new AppError("Product's name already exists", 409);
        }
    }

    const updatedProduct = await prisma.product.update({
        where: { product_id: id },
        data: { ...payload },
    });

    return updatedProduct;
};

const deleteProduct = async (id: string) => {
    // isExist?
    const exists = await prisma.product.findUnique({
        where: { product_id: id },
    });
    if (!exists) {
        throw new AppError("Product not found", 404);
    }

    const deletedProduct = await prisma.product.delete({
        where: { product_id: id },
    });

    return deletedProduct;
};

export const productService = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
};
