import { Request, Response } from "express";
import AppError from "../../utils/appError.util.js";
import { ApiResponse, IdParams } from "../../types/api.interface.js";
import {
    createOrderRequest,
    updateOrderStatusRequest,
} from "../../types/orders.interface.js";
import { ordersService } from "./orders.service.js";
import { User } from "../../types/auth.interface.js";
import { OrderStatus } from "../../generated/prisma/enums.js";
import { MidtransWebhookPayload } from "../../types/midtrans.interface.js";

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
    const createdOrder = await ordersService.createOrder(
        shipping_address,
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
    const orders = await ordersService.getOrders(user_id);

    res.status(200).json({
        success: true,
        data: orders,
    });
};

export const getOrderDetail = async (
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

    const order = await ordersService.getOrderDetail(id);

    res.status(200).json({
        success: true,
        data: order,
    });
};

export const updateOrderStatus = async (
    req: Request<IdParams, {}, updateOrderStatusRequest>,
    res: Response<ApiResponse>,
) => {
    let { id } = req.params;
    let { status, tracking_number } = req.body;

    // empty check
    if (!id) {
        throw new AppError("Params must be filled", 400);
    }
    if (!status) {
        throw new AppError("Payload must be filled", 400);
    }

    // type check
    if (typeof id !== "string") {
        throw new AppError("Parameter Id should be a string", 400);
    }
    if (typeof status !== "string") {
        throw new AppError("Status should be a string", 400);
    }
    if (tracking_number && typeof tracking_number !== "string") {
        throw new AppError("Tracking number should be a string", 400);
    }

    // check invalid status
    if (!Object.values(OrderStatus).includes(status)) {
        throw new AppError("Invalid status value", 400);
    }

    // sanitation
    id = id.trim();
    if (tracking_number) tracking_number = tracking_number.trim();

    const updatedOrder = await ordersService.updateOrderStatus(
        id,
        status,
        tracking_number,
    );

    res.status(200).json({
        success: true,
        data: updatedOrder,
    });
};

export const midtransWebhook = async (
    req: Request<{}, {}, MidtransWebhookPayload>,
    res: Response,
) => {
    const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
    } = req.body;

    if (
        !order_id ||
        !status_code ||
        !gross_amount ||
        !signature_key ||
        !transaction_status
    ) {
        throw new AppError("Missing payload", 400);
    }

    await ordersService.handleWebhook(req.body);

    res.status(200).json({
        success: true,
        message: "Webhook processed",
    });
};
