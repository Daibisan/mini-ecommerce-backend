import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import { createOrder, getOrderDetail, getOrders } from "./orders.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderDetail);

export const order_router = router;
