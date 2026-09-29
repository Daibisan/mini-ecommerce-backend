import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct,
} from "./product.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { IdParamsSchema } from "../../schemas/common.schema.js";
import {
    CreateProductBodySchema,
    UpdateProductBodySchema,
} from "./product.schema.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProducts);
router.get("/:id", validate({ params: IdParamsSchema }), getProduct);

// ADMIN
router.use(requireAuth, authorize("ADMIN"));

router.post("/", validate({ body: CreateProductBodySchema }), createProduct);
router.patch(
    "/:id",
    validate({ body: UpdateProductBodySchema, params: IdParamsSchema }),
    updateProduct,
);
router.delete("/:id", validate({ params: IdParamsSchema }), deleteProduct);

export const product_router = router;
