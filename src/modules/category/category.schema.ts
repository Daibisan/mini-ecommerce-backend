import { z } from "zod";

export const categoryBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { error: "Category's name must be filled" })
        .refine((val) => !/^\d+$/.test(val), {
            error: "Category name can not only number",
        }),
});

export type CreateCategoryBody = z.infer<typeof categoryBodySchema>;
export type UpdateCategoryBody = z.infer<typeof categoryBodySchema>;
