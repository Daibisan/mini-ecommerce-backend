import { z } from "zod";
import { OrderStatus } from "../../generated/prisma/enums.js";

export const CreateOrderBodySchema = z.object({
    shipping_address: z
        .string()
        .trim()
        .min(1, { error: "Shipping address must be filled" })
        .refine((val) => !/^\d+$/.test(val), {
            error: "Shipping address can not only number",
        }),
});

export const UpdateOrderStatusBodySchema = z.object({
    status: z.enum(OrderStatus),
    tracking_number: z.string().trim().optional(),
});

export const MidtransWebhookBodySchema = z.looseObject({
    // 1. Base / Required
    order_id: z.uuid().min(1, { error: "order_id is required" }),
    transaction_id: z.string().min(1, { error: "transaction_id is required" }),
    transaction_status: z.enum([
        "settlement",
        "capture",
        "pending",
        "deny",
        "cancel",
        "expire",
    ]),
    gross_amount: z.string().min(1, { error: "gross_amount is required" }),
    payment_type: z.string().min(1, { error: "payment_type is required" }),
    status_code: z.string().min(1, { error: "status_code is required" }),
    status_message: z.string().min(1, { error: "status_message is required" }),
    transaction_time: z
        .string()
        .min(1, { error: "transaction_time is required" }),
    merchant_id: z.string().min(1, { error: "merchant_id is required" }),
    signature_key: z.string().min(1, { error: "signature_key is required" }),
    currency: z.string().default("IDR"),

    // 2. Optional
    fraud_status: z.enum(["accept", "challenge", "deny"]).optional(),
    va_numbers: z
        .array(
            z.object({
                va_number: z.string(),
                bank: z.string(),
            }),
        )
        .optional(),
    acquirer: z.string().optional(),
});

export type CreateOrderBody = z.infer<typeof CreateOrderBodySchema>;
export type UpdateOrderStatusBody = z.infer<typeof UpdateOrderStatusBodySchema>;
export type MidtransWebhookBody = z.infer<typeof MidtransWebhookBodySchema>;
