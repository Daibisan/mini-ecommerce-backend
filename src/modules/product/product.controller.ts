import { Request, Response } from "express";
import AppError from "../../utils/appError.util.js";
import { ApiResponse } from "../../types/api.interface.js";
import { productService } from "./product.service.js";
import { IdParams } from "../../schemas/common.schema.js";
import { CreateProductBody, UpdateProductBody } from "./product.schema.js";

// PUBLIC
export const getAllProducts = async (
    _req: Request,
    res: Response<ApiResponse>,
) => {
    const product = await productService.getAllProducts();

    res.status(200).json({
        success: true,
        data: product,
    });
};

export const getProduct = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    const product = await productService.getProduct(req.params.id);

    res.status(200).json({
        success: true,
        data: product,
    });
};

// ADMIN
export const createProduct = async (
    req: Request<{}, {}, CreateProductBody>,
    res: Response<ApiResponse>,
) => {
    const newProduct = await productService.createProduct(req.body);

    res.status(201).json({
        success: true,
        message: "Product created!",
        data: newProduct,
    });
};

export const updateProduct = async (
    req: Request<IdParams, {}, UpdateProductBody>,
    res: Response<ApiResponse>,
) => {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "Product updated!",
        data: updatedProduct,
    });
};

export const deleteProduct = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    res.status(200).json({
        success: true,
        message: "Product deleted!",
        data: deletedProduct,
    });
};
