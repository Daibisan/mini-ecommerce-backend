import { Request, Response } from "express";
import { categoryService } from "./category.service.js";
import { ApiResponse } from "../../types/api.interface.js";
import { IdParams } from "../../schemas/common.schema.js";
import { CreateCategoryBody, UpdateCategoryBody } from "./category.schema.js";

// PUBLIC
export const getAllCategories = async (
    _req: Request,
    res: Response<ApiResponse>,
) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        data: categories,
    });
};

export const getCategory = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    const category = await categoryService.getCategory(req.params.id);

    res.status(200).json({
        success: true,
        data: category,
    });
};

// ADMIN
export const createCategory = async (
    req: Request<{}, {}, CreateCategoryBody>,
    res: Response<ApiResponse>,
) => {
    const newCategory = await categoryService.createCategory(req.body.name);

    res.status(201).json({
        success: true,
        message: "Category created!",
        data: newCategory,
    });
};

export const updateCategory = async (
    req: Request<IdParams, {}, UpdateCategoryBody>,
    res: Response<ApiResponse>,
) => {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body.name);

    res.status(200).json({
        success: true,
        message: "Category updated!",
        data: updatedCategory,
    });
};

export const deleteCategory = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);

    res.status(200).json({
        success: true,
        message: "Category deleted!",
        data: deletedCategory,
    });
};
