import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import { createOrder, getOrderDetail, getOrders, updateOrderStatus } from "./orders.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderDetail);
router.patch("/:id/status", updateOrderStatus);

export const order_router = router;
