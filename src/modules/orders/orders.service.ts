import { Decimal } from "../../generated/prisma/internal/prismaNamespace.js";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";

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
        cart.items.forEach(async (item) => {
            await tx.product.update({
                where: {
                    product_id: item.product_id,
                },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        });

        // 3. Clear cart
        await tx.cartItem.deleteMany({
            where: {
                cart_id: cart.cart_id,
            },
        });

        return order;
    });

    return createdOrder;
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

export const orderService = {
    createOrder,
    getOrders,
};
