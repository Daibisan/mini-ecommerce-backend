import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { auth_router } from "./modules/auth/auth.route.js";
import { category_router } from "./modules/category/category.route.js";
import helmet from "helmet";
import { product_router } from "./modules/product/product.route.js";
import { cart_router } from "./modules/cart/cart.route.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.middleware.js";
import { order_router } from "./modules/order/order.route.js";
import { catchAll } from "./middleware/catchAll.middleware.js";
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
import path from "path";
import { health_router } from "./modules/health/health.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (env.NODE_ENV !== "production") {
    // dev logger
    app.use((req, _res, next) => {
        console.log(req.method, req.path);
        console.log("User-Agent:", req.headers["user-agent"]);
        next();
    });

    // swagger api docs
    const swaggerDocument = YAML.load(path.join(process.cwd(), 'docs/openapi.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// health
app.use("/health", health_router);

// feat routes
app.use("/api/auth", auth_router);
app.use("/api/categories", category_router);
app.use("/api/products", product_router);
app.use("/api/cart", cart_router);
app.use("/api/orders", order_router);

app.use(catchAll); // endpoint not found handler

// error handler
app.use(globalErrorHandler);

export default app;
