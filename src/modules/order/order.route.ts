import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import {
    createOrder,
    getOrderDetail,
    getOrders,
    midtransWebhook,
    updateOrderStatus,
} from "./order.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
    CreateOrderBodySchema,
    MidtransWebhookBodySchema,
    UpdateOrderStatusBodySchema,
} from "./order.schema.js";
import { IdParamsSchema } from "../../schemas/common.schema.js";
import authorize from "../../middleware/authorize.middleware.js";

const router = express.Router();

// webhook for midtrans payment gateway
router.post(
    "/webhook",
    validate({ body: MidtransWebhookBodySchema }),
    midtransWebhook,
);

router.use(requireAuth);

router.post("/", validate({ body: CreateOrderBodySchema }), createOrder);
router.get("/", getOrders);
router.get("/:id", validate({ params: IdParamsSchema }), getOrderDetail);
router.patch(
    "/:id/status", 
    authorize("ADMIN"),
    validate({ params: IdParamsSchema, body: UpdateOrderStatusBodySchema }),
    updateOrderStatus,
);

export const order_router = router;
