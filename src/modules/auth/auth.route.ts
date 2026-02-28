import express from "express";
import { login, register } from "./auth.controller.js";

export const auth_router = express.Router();

auth_router.post("/register", register);
auth_router.post("/login", login);
