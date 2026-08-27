import { Request, Response } from "express";
import AppError from "../../utils/appError.util.js";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import {
    AddToCartRequest,
    UpdateCartRequest,
} from "../../types/carts.interface.js";
import { cartService } from "./carts.service.js";
import { User } from "../../types/auth.interface.js";

export const addToCart = async (
    req: Request<{}, {}, AddToCartRequest>,
    res: Response<ApiResponse>,
) => {
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
    const addedProduct = await cartService.addToCart(
        product_id,
        quantity,
        user_id,
    );

    res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: addedProduct,
    });
};

export const getCart = async (req: Request, res: Response<ApiResponse>) => {
    const { user_id } = req.user as User;
    const cart = await cartService.getCart(user_id);

    res.status(200).json({
        success: true,
        data: cart,
    });
};

export const updateQuantity = async (
    req: Request<IdParams, {}, UpdateCartRequest>,
    res: Response<ApiResponse>,
) => {
    let { id } = req.params;
    const { quantity } = req.body;

    // empty check
    if (!id || !quantity) {
        throw new AppError("Payload & Params must be filled", 400);
    }

    // type check
    if (typeof id !== "string") {
        throw new AppError("Parameter Id should be a string", 400);
    }
    if (!Number.isInteger(quantity)) {
        throw new AppError("Quantity type should be integer", 400);
    }

    // sanitation
    id = id.trim();

    const updatedCartItem = await cartService.updateCartItem(id, quantity);

    res.status(200).json({
        success: true,
        message: "Cart item updated",
        data: updatedCartItem,
    });
};

export const removeCartItem = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    let { id } = req.params;

    // empty check
    if (!id) {
        throw new AppError("Params must be filled", 400);
    }

    // type check
    if (typeof id !== "string") {
        throw new AppError("Parameter Id should be a string", 400);
    }

    // sanitation
    id = id.trim();

    await cartService.removeCartItem(id);

    res.status(200).json({
        success: true,
        message: "Item removed from cart",
    });
};

export const clearCart = async (req: Request, res: Response<ApiResponse>) => {
    const { user_id } = req.user as User;

    await cartService.clearCart(user_id);

    res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
    });
};
