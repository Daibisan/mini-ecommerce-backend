import express from "express";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./categories.controller.js";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCategories);
router.get("/:id", getCategory);

// ADMIN
router.use(requireAuth, authorize("ADMIN"));

router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export const categories_router = router;
