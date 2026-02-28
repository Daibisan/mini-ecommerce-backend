import express from "express";
import { createCategory, updateCategory } from "./categories.controller.js";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";

const router = express.Router();

router.use(requireAuth, authorize("ADMIN"));

router.post("/", createCategory);
router.patch("/:id", updateCategory);

export const categories_router = router;
