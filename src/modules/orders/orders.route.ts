import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import { createOrder, getOrders } from "./orders.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getOrders);

export const order_router = router;
