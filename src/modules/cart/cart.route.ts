import express from "express";
import requireAuth from "../../middleware/requireAuth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { addToCart } from "./cart.controller.js";

const router = express.Router();

router.use(requireAuth);

// router.get("/", );
// router.delete("/", );

router.post("/items", addToCart);
// router.patch("/items/:id", );
// router.delete("/items/:id", );

export const cart_router = router;
