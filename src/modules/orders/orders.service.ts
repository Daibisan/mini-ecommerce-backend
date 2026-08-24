import crypto from "crypto";
import { OrderStatus } from "../../generated/prisma/enums.js";
import { snap } from "../../lib/midtrans.js";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";
import { MidtransWebhookPayload } from "../../types/midtrans.interface.js";

const createOrder = async (shipping_address: string, user_id: string) => {
    const cart = await prisma.cart.findUnique({
        where: { user_id },
        select: {
            cart_id: true,
            user_id: true,
            items: {
                select: {
                    cart_item_id: true,
                    product_id: true,
                    quantity: true,
                    product: {
                        select: {
                            name: true,
                            price: true,
                            stock: true,
                        },
                    },
                },
            },
        },
    });

    // check cart existance
    if (!cart) throw new AppError("Cart is not exist", 404);

    // check cart emptiness
    if (cart.items.length === 0) throw new AppError("Cart is empty", 404);

    // check stock for each cart_items
    let total_price = 0;
    cart.items.forEach((item) => {
        if (item.quantity > item.product.stock)
            throw new AppError(`${item.product.name} is out of stock`, 422);

        // calculate total price
        total_price += item.quantity * item.product.price.toNumber();
    });

    // create new order
    const createdOrder = await prisma.$transaction(async (tx) => {
        // 1. create order & order_items
        const order = await tx.order.create({
            data: {
                user_id,
                total_price,
                shipping_address,
                order_items: {
                    create: cart.items.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.product.price.toNumber(),
                    })),
                },
            },
            select: {
                order_id: true,
                total_price: true,
                status: true,
                shipping_address: true,
            },
        });

        // 2. decrease each product stock
        for (const item of cart.items) {
            await tx.product.update({
                where: {
                    product_id: item.product_id,
                },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }

        // 3. Clear cart
        await tx.cartItem.deleteMany({
            where: {
                cart_id: cart.cart_id,
            },
        });

        return order;
    });

    // midtrans payment gateway
    const parameter = {
        transaction_details: {
            order_id: createdOrder.order_id,
            gross_amount: createdOrder.total_price,
        },
    };

    const midtransTransaction = await snap.createTransaction(parameter);

    const finalOrder = await prisma.order.update({
        where: { order_id: createdOrder.order_id },
        data: {
            payment_token: midtransTransaction.token,
            payment_url: midtransTransaction.redirect_url,
        },
    });

    return finalOrder;
};

const getOrders = async (user_id: string) => {
    return await prisma.order.findMany({
        where: { user_id },
        select: {
            order_id: true,
            total_price: true,
            status: true,
            created_at: true,
        },
    });
};

const getOrderDetail = async (order_id: string) => {
    const order = await prisma.order.findUnique({
        where: { order_id },
        select: {
            order_id: true,
            total_price: true,
            status: true,
            shipping_address: true,
            tracking_number: true,
            created_at: true,
            order_items: {
                select: {
                    order_item_id: true,
                    product_id: true,
                    quantity: true,
                    price: true,
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return order;
};

const updateOrderStatus = async (
    order_id: string,
    status: OrderStatus,
    tracking_number?: string,
) => {
    // Check order existance
    const order = await prisma.order.findUnique({
        where: { order_id },
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const updatedOrder = await prisma.order.update({
        where: { order_id },
        data: { status, tracking_number },
        select: {
            order_id: true,
            status: true,
            tracking_number: true,
        },
    });

    return updatedOrder;
};

export const handleWebhook = async (payload: MidtransWebhookPayload) => {
    const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        fraud_status,
    } = payload;

    // 1. Signature Key Verification
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    const hashData = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
        .createHash("sha512")
        .update(hashData)
        .digest("hex");

    if (expectedSignature !== signature_key) {
        throw new Error("Invalid signature key! Invalid Webhook.");
    }

    // 2. Update status
    let newStatus: OrderStatus = "PENDING";

    if (transaction_status === "settlement") {
        newStatus = "PAID";
    } else if (transaction_status === "capture") {
        if (fraud_status === "accept") {
            newStatus = "PAID";
        }
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
        newStatus = "CANCELLED";
    }

    // 3. Update database
    if (newStatus !== "PENDING") {
        const updatedOrder = await prisma.order.updateMany({
            where: { order_id },
            data: { status: newStatus },
        });

        if (updatedOrder.count === 0)
            throw new AppError("Order not found", 404);
    }

    return true;
};

export const ordersService = {
    createOrder,
    getOrders,
    getOrderDetail,
    updateOrderStatus,
    handleWebhook,
};
