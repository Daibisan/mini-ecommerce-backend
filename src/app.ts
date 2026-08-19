import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { auth_router } from "./modules/auth/auth.route.js";
import { categories_router } from "./modules/categories/categories.route.js";
import helmet from "helmet";
import { products_router } from "./modules/products/products.route.js";
import { cart_router } from "./modules/carts/carts.route.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.middleware.js";
import { order_router } from "./modules/orders/orders.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// dev logger
if (env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(req.method, req.path);
        console.log("User-Agent:", req.headers["user-agent"]);
        next();
    });
}

// health
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

// routes
app.use("/api/auth", auth_router);
app.use("/api/categories", categories_router);
app.use("/api/products", products_router);
app.use("/api/cart", cart_router);
app.use("/api/orders", order_router);

// error handler
app.use(globalErrorHandler);

export default app;
