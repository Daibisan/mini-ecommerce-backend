import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { addToCart, clearCart, getCart, removeCartItem, updateQuantity } from "./carts.controller.js";

const router = express.Router();

router.use(requireAuth);

// api/cart
router.get("/", getCart);
router.delete("/", clearCart);

// api/cart/items
router.post("/items", addToCart);
router.patch("/items/:id", updateQuantity);
router.delete("/items/:id", removeCartItem);

export const cart_router = router;
