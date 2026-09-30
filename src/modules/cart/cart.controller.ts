import { Request, Response } from "express";
import { ApiResponse } from "../../types/api.interface.js";
import { cartService } from "./cart.service.js";
import { User } from "../../types/auth.interface.js";
import { AddToCartBody, UpdateCartBody } from "./cart.schema.js";
import { IdParams } from "../../schemas/common.schema.js";

export const addToCart = async (
    req: Request<{}, {}, AddToCartBody>,
    res: Response<ApiResponse>,
) => {
    const { user_id } = req.user as User;
    const addedProduct = await cartService.addToCart(
        req.body.product_id,
        req.body.quantity,
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
    req: Request<IdParams, {}, UpdateCartBody>,
    res: Response<ApiResponse>,
) => {
    const { user_id } = req.user as User;
    const updatedCartItem = await cartService.updateCartItem(user_id, req.params.id, req.body.quantity);

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
    const { user_id } = req.user as User;
    await cartService.removeCartItem(user_id, req.params.id);

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
