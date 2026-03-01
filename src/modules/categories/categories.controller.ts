import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import validator from "validator";
import { categoryService } from "./categories.service.js";
import { ApiResponse } from "../../types/api.interface.js";
import {
    CategoryParams,
    CategoryRequest,
} from "../../types/categories.intereface.js";

// PUBLIC
export const getAllCategories: RequestHandler<{}, ApiResponse> = async (
    req,
    res,
) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        data: categories,
    });
};

export const getCategory: RequestHandler<CategoryParams, ApiResponse> = async (
    req,
    res,
) => {
    const { id } = req.params;

    const category = await categoryService.getCategory(id);

    res.status(200).json({
        success: true,
        data: category,
    });
};

// ADMIN
export const createCategory: RequestHandler<
    {},
    ApiResponse,
    CategoryRequest
> = async (req, res) => {
    let { name } = req.body;

    // empty payload?
    if (!name) {
        throw new AppError("Category's name must be filled", 400);
    }

    // sanitize data
    name = validator.escape(name);

    // name contains number?
    if (!validator.isAlpha(name)) {
        throw new AppError("Category name can not contain number", 400);
    }

    const newCategory = await categoryService.createCategory(name);

    res.status(201).json({
        success: true,
        message: "Category created!",
        data: newCategory,
    });
};

export const updateCategory: RequestHandler<
    CategoryParams,
    ApiResponse,
    CategoryRequest
> = async (req, res) => {
    const { id } = req.params;
    let { name } = req.body;

    // empty payload?
    if (!name) {
        throw new AppError("Category's name must be filled", 400);
    }

    // sanitize data
    name = validator.escape(name);

    // name contains number?
    if (!validator.isAlpha(name)) {
        throw new AppError("Category name can not contain number", 400);
    }

    const updatedCategory = await categoryService.updateCategory(id, name);

    res.status(200).json({
        success: true,
        message: "Category updated!",
        data: updatedCategory,
    });
};

export const deleteCategory: RequestHandler<
    CategoryParams,
    ApiResponse
> = async (req, res) => {
    const { id } = req.params;

    const deletedCategory = await categoryService.deleteCategory(id);

    res.status(200).json({
        success: true,
        message: "Category deleted!",
        data: deletedCategory,
    });
};
