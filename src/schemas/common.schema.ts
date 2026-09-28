import { z } from "zod";

export const IdParamsSchema = z.object({
    id: z.uuid({ error: "Invalid UUID Format" })
});

export type IdParams = z.infer<typeof IdParamsSchema>;