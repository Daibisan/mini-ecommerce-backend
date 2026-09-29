import { z } from "zod";

export const CreateProductBodySchema = z.object({
    name: z.string().trim().min(1, { error: "Product name cannot be empty" }),

    description: z.string().trim().optional(),

    price: z.number().positive({ error: "Price must be greater than 0" }),

    stock: z
        .number()
        .int({ error: "Stock must be an integer" })
        .nonnegative({ error: "Stock cannot be negative" }),

    category_id: z.uuid({ error: "Invalid category ID format" }),
});

export const UpdateProductBodySchema = z
    .object({
        name: z.string().trim().optional(),

        description: z.string().trim().optional(),

        price: z
            .number()
            .positive({ error: "Price must be greater than 0" })
            .optional(),

        stock: z
            .number()
            .int({ error: "Stock must be an integer" })
            .nonnegative({ error: "Stock cannot be negative" })
            .optional(),

        category_id: z.uuid({ error: "Invalid category ID format" }).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        error: "New Product's data must be filled at least one",
    });

export type CreateProductBody = z.infer<typeof CreateProductBodySchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
