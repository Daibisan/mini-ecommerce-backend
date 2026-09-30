import express from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
    updateCategory,
} from "./category.controller.js";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { IdParamsSchema } from "../../schemas/common.schema.js";
import { CategoryBodySchema } from "./category.schema.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCategories);
router.get("/:id", validate({ params: IdParamsSchema }), getCategory);

// ADMIN
router.use(requireAuth, authorize("ADMIN"));

router.post("/", validate({ body: CategoryBodySchema }), createCategory);
router.patch(
    "/:id",
    validate({ body: CategoryBodySchema, params: IdParamsSchema }),
    updateCategory,
);
router.delete("/:id", validate({ params: IdParamsSchema }), deleteCategory);

export const category_router = router;
