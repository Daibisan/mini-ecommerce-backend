import express from "express";
import { login, register } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginBodySchema, registerBodySchema } from "./auth.schema.js";

export const auth_router = express.Router();

auth_router.post("/register", validate({ body: registerBodySchema }), register);
auth_router.post("/login", validate({ body: loginBodySchema }), login);
