import { Request, Response } from "express";
import AppError from "../../utils/appError.util.js";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import { createOrderRequest } from "../../types/orders.interface.js";
import { orderService } from "./orders.service.js";
import { User } from "../../types/auth.interface.js";

export const createOrder = async (
    req: Request<{}, {}, createOrderRequest>,
    res: Response<ApiResponse>,
) => {
    let { shipping_address } = req.body;

    // empty check
    if (!shipping_address) {
        throw new AppError("Payload must be filled", 400);
    }

    // type check
    if (typeof shipping_address !== "string") {
        throw new AppError("Shipping address type should be a string", 400);
    }

    // sanitation
    shipping_address = shipping_address.trim();

    const { user_id } = req.user as User;
    const createdOrder = await orderService.createOrder(shipping_address, user_id);

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: createdOrder,
    });
};

export const getOrders = async (req: Request, res: Response<ApiResponse>) => {
    const { user_id } = req.user as User;
    const orders = await orderService.getOrders(user_id);

    res.status(200).json({
        success: true,
        data: orders,
    });
};