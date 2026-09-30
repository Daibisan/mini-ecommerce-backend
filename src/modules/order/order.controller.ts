import { Request, Response } from "express";
import { ApiResponse } from "../../types/api.interface.js";
import { orderService } from "./order.service.js";
import { User } from "../../types/auth.interface.js";
import { CreateOrderBody, MidtransWebhookBody, UpdateOrderStatusBody } from "./order.schema.js";
import { IdParams } from "../../schemas/common.schema.js";

export const createOrder = async (
    req: Request<{}, {}, CreateOrderBody>,
    res: Response<ApiResponse>,
) => {
    const { user_id } = req.user as User;
    const createdOrder = await orderService.createOrder(
        req.body.shipping_address,
        user_id,
    );

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

export const getOrderDetail = async (
    req: Request<IdParams>,
    res: Response<ApiResponse>,
) => {
    const order = await orderService.getOrderDetail(req.params.id);

    res.status(200).json({
        success: true,
        data: order,
    });
};

export const updateOrderStatus = async (
    req: Request<IdParams, {}, UpdateOrderStatusBody>,
    res: Response<ApiResponse>,
) => {
    const updatedOrder = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.body.tracking_number,
    );

    res.status(200).json({
        success: true,
        data: updatedOrder,
    });
};

export const midtransWebhook = async (
    req: Request<{}, {}, MidtransWebhookBody>,
    res: Response,
) => {
    await orderService.handleWebhook(req.body);

    res.status(200).json({
        success: true,
        message: "Webhook processed",
    });
};
