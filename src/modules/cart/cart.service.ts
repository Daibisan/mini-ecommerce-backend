import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/appError.util.js";

const addToCart = async (
    product_id: string,
    quantity: number,
    user_id: string,
) => {
    // Check product existance
    const product = await prisma.product.findUnique({
        where: { product_id },
    });
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    // Check product stock
    if (quantity > product.stock) {
        throw new AppError("Quantity higher than the stock", 400);
    }

    // Check cart existence
    let cart = await prisma.cart.findUnique({
        where: { user_id },
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                user_id,
            },
        });
    }

    // Check product existance in cart through cartItems
    const cart_id = cart.cart_id;

    let cartItem = await prisma.cartItem.findFirst({
        where: { cart_id, product_id },
    });

    if (cartItem) {
        // Just add the quantity if cartItem found
        const newQuantity = cartItem.quantity + quantity;

        return await prisma.cartItem.update({
            where: { cart_item_id: cartItem.cart_item_id },
            data: { quantity: newQuantity },
            omit: {
                created_at: true,
                updated_at: true,
            },
        });
    }

    // Add product to cart through cartItems
    const addedProduct = await prisma.cartItem.create({
        data: {
            cart_id,
            product_id,
            quantity,
        },
        omit: {
            created_at: true,
            updated_at: true,
        },
    });
    return addedProduct;
};

const getCart = async (user_id: string) => {
    return await prisma.cart.findUnique({
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
                        },
                    },
                },
            },
        },
    });
};

const updateCartItem = async (cart_item_id: string, quantity: number) => {
    // Check cartItem existance
    const cartItem = await prisma.cartItem.findFirst({
        where: { cart_item_id },
    });

    if (!cartItem) {
        throw new AppError("CartItem not found", 404);
    }

    return await prisma.cartItem.update({
        where: { cart_item_id },
        data: { quantity },
        select: {
            cart_item_id: true,
            quantity: true,
        },
    });
};

export const cartService = {
    addToCart,
    getCart,
    updateCartItem,
};
