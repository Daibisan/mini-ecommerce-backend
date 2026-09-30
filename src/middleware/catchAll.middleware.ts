import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.util.js";

export const catchAll = (_req: Request, _res: Response, _next: NextFunction) => {
    throw new AppError(`Endpoint not found`, 404);
};
