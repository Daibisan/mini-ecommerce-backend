import express from "express";
import cors from "cors";
import auth_router from "./modules/auth/auth.route.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { env } from "./config/env.js";
import requireAuth from "./middleware/requireAuth.middleware.js";
import authorize from "./middleware/authorize.middleware.js";

const app = express();

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

app.use(requireAuth, authorize("USER"));
app.get("/test/requireAuth", (req, res) => {
    res.status(200).json({ message: "ok" });
});

// routes
app.use("/api/auth", auth_router);

// error handler
app.use(errorHandler);

export default app;
