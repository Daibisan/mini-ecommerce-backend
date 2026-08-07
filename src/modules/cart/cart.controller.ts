import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import validator from "validator";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import { AddToCartRequest } from "../../types/cart.interface.js";
import { cartService } from "./cart.service.js";
import { User } from "../../types/auth.interface.js";

// ADMIN
export const addToCart: RequestHandler<
    {},
    ApiResponse,
    AddToCartRequest
> = async (req, res) => {
    let { product_id, quantity } = req.body;

    // empty check
    if (!product_id || !quantity) {
        throw new AppError("Payload must be filled", 400);
    }

    // type check
    if (typeof product_id !== "string") {
        throw new AppError("Product Id type should be string", 400);
    }
    if (!Number.isInteger(quantity)) {
        throw new AppError("Quantity type should be integer", 400);
    }

    // sanitation
    product_id = product_id.trim();

    const { user_id } = req.user as User;
    const addedProduct = await cartService.addToCart(product_id, quantity, user_id);

    res.status(200).json({
        success: true,
        message: "Product added to cart!",
        data: addedProduct,
    });
};
