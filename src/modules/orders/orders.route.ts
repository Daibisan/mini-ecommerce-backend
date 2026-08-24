import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import { createOrder, getOrderDetail, getOrders, midtransWebhook, updateOrderStatus } from "./orders.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderDetail);
router.patch("/:id/status", updateOrderStatus);

// webhook for midtrans payment gateway
router.post("/webhook", midtransWebhook);

export const order_router = router;
