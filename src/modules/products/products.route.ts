import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "./products.controller.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// ADMIN
router.use(requireAuth, authorize("ADMIN"));

router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export const products_router = router;
