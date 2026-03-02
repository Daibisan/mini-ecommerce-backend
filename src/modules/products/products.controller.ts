import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import validator from "validator";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import { ProductRequest } from "../../types/products.intereface.js";
import { productService } from "./products.service.js";

// PUBLIC
export const getAllProducts: RequestHandler<{}, ApiResponse> = async (
    req,
    res,
) => {
    const product = await productService.getAllProducts();

    res.status(200).json({
        success: true,
        data: product,
    });
};

export const getProduct: RequestHandler<IdParams, ApiResponse> = async (
    req,
    res,
) => {
    let { id } = req.params;

    // payload sanitation
    id = validator.escape(id.trim());

    const product = await productService.getProduct(id);

    res.status(200).json({
        success: true,
        data: product,
    });
};

// ADMIN
export const createProduct: RequestHandler<
    {},
    ApiResponse,
    ProductRequest
> = async (req, res) => {
    let { name, description, price, stock, category_id } = req.body;

    // empty payload?
    if (!name || !price || !stock || !category_id) {
        throw new AppError("Product's data must be filled", 400);
    }

    // name OR desc OR category_id is a number?
    if (typeof name === "number") {
        throw new AppError("Product's name should be a string", 400);
    }
    if (typeof description === "number") {
        throw new AppError("Product's desc should be a string", 400);
    }
    if (typeof category_id === "number") {
        throw new AppError("Product's category should be a string", 400);
    }

    // payload sanitation
    name = validator.escape(name.trim());
    if (description) description = validator.escape(description).trim();
    category_id = validator.escape(category_id.trim());

    // price OR stock not a number?
    if (typeof price !== "number") {
        throw new AppError("Product's price should be a number", 400);
    }
    if (typeof stock !== "number") {
        throw new AppError("Product's stock should be a number", 400);
    }

    const payload = { name, description, price, stock, category_id };
    const newProduct = await productService.createProduct(payload);

    res.status(201).json({
        success: true,
        message: "Product created!",
        data: newProduct,
    });
};

export const updateProduct: RequestHandler<
    IdParams,
    ApiResponse,
    Partial<ProductRequest>
> = async (req, res) => {
    let { id } = req.params;
    let { name, description, price, stock, category_id } = req.body;

    // empty payload?
    if (!name && !price && !stock && !category_id && !description) {
        throw new AppError("New Product's data must be filled at least one", 400);
    }

    // name OR desc OR category_id is a number?
    if (name && typeof name === "number") {
        throw new AppError("Product's name should be a string", 400);
    }
    if (description && typeof description === "number") {
        throw new AppError("Product's desc should be a string", 400);
    }
    if (category_id && typeof category_id === "number") {
        throw new AppError("Product's category should be a string", 400);
    }

    // payload & params sanitation
    id = validator.escape(id.trim());
    if (name) name = validator.escape(name.trim());
    if (description) description = validator.escape(description.trim());
    if (category_id) category_id = validator.escape(category_id.trim());

    // price OR stock not a number?
    if (typeof price !== "number") {
        throw new AppError("Product's price should be a number", 400);
    }
    if (typeof stock !== "number") {
        throw new AppError("Product's stock should be a number", 400);
    }

    const payload = { name, description, price, stock, category_id };
    const updatedProduct = await productService.updateProduct(id, payload);

    res.status(200).json({
        success: true,
        message: "Product updated!",
        data: updatedProduct,
    });
};

export const deleteProduct: RequestHandler<IdParams, ApiResponse> = async (
    req,
    res,
) => {
    let { id } = req.params;

    // payload sanitation
    id = validator.escape(id.trim());

    const deletedProduct = await productService.deleteProduct(id);

    res.status(200).json({
        success: true,
        message: "Product deleted!",
        data: deletedProduct,
    });
};
