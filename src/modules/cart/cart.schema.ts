import { z } from "zod";

export const AddToCartBodySchema = z.object({
    quantity: z
        .number()
        .int()
        .positive({ error: "Quantity must be greater than 0" }),

    product_id: z.uuid({ error: "Invalid Product ID format" }),
});

export const UpdateCartBodySchema = z.object({
    quantity: z
        .number()
        .int()
        .positive({ error: "Quantity must be greater than 0" }),
});

export type AddToCartBody = z.infer<typeof AddToCartBodySchema>;
export type UpdateCartBody = z.infer<typeof UpdateCartBodySchema>;
