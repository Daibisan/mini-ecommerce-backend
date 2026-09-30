import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import {
    addToCart,
    clearCart,
    getCart,
    removeCartItem,
    updateQuantity,
} from "./cart.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { IdParamsSchema } from "../../schemas/common.schema.js";
import { AddToCartBodySchema, UpdateCartBodySchema } from "./cart.schema.js";

const router = express.Router();

router.use(requireAuth);

// api/cart
router.get("/", getCart);
router.delete("/", clearCart);

// api/cart/items
router.post("/items", validate({ body: AddToCartBodySchema }), addToCart);
router.patch(
    "/items/:id",
    validate({ params: IdParamsSchema, body: UpdateCartBodySchema }),
    updateQuantity,
);
router.delete(
    "/items/:id",
    validate({ params: IdParamsSchema }),
    removeCartItem,
);

export const cart_router = router;
