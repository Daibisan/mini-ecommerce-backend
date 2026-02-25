import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// dev logger
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(req.method, req.path);
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
// error handler

export default app;