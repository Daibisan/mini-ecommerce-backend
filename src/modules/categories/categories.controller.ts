import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import { categoryService } from "./categories.service.js";

interface CreateCategoryBody {
    name: string;
}

export const createCategory: RequestHandler = async (req, res) => {
    const { name }: CreateCategoryBody = req.body;

    // check empty input
    if (!name) {
        throw new AppError("Category's name must be filled", 400);
    }

    const newCategory = await categoryService.createCategory(name);

    res.status(201).json({
        data: newCategory,
    });
};
