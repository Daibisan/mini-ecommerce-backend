import { OrderStatus } from "../generated/prisma/enums.js";

export interface createOrderRequest {
    shipping_address: string;
}

export interface updateOrderStatusRequest {
    status: OrderStatus;
    tracking_number?: string;
}
