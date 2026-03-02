import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import validator from "validator";
import { categoryService } from "./categories.service.js";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import { CategoryRequest } from "../../types/categories.intereface.js";

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

export const getCategory: RequestHandler<IdParams, ApiResponse> = async (
    req,
    res,
) => {
    let { id } = req.params;

    // payload sanitation
    id = validator.escape(id.trim());

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

    // name is a number?
    if (typeof name === "number") {
        throw new AppError("Category's name should be a string", 400);
    }

    // payload sanitation
    name = validator.escape(name.trim());

    // name contains number?
    if (validator.isNumeric(name)) {
        throw new AppError("Category name can not only number", 400);
    }

    const newCategory = await categoryService.createCategory(name);

    res.status(201).json({
        success: true,
        message: "Category created!",
        data: newCategory,
    });
};

export const updateCategory: RequestHandler<
    IdParams,
    ApiResponse,
    CategoryRequest
> = async (req, res) => {
    let { id } = req.params;
    let { name } = req.body;

    // empty payload?
    if (!name) {
        throw new AppError("Category's name must be filled", 400);
    }

    // name is a number?
    if (typeof name === "number") {
        throw new AppError("Category's name should be a string", 400);
    }

    // payload sanitation
    id = validator.escape(id.trim());
    name = validator.escape(name.trim());

    // name contains number?
    if (validator.isNumeric(name)) {
        throw new AppError("Category name can not only number", 400);
    }

    const updatedCategory = await categoryService.updateCategory(id, name);

    res.status(200).json({
        success: true,
        message: "Category updated!",
        data: updatedCategory,
    });
};

export const deleteCategory: RequestHandler<IdParams, ApiResponse> = async (
    req,
    res,
) => {
    let { id } = req.params;

    // payload sanitation
    id = validator.escape(id.trim());

    const deletedCategory = await categoryService.deleteCategory(id);

    res.status(200).json({
        success: true,
        message: "Category deleted!",
        data: deletedCategory,
    });
};
