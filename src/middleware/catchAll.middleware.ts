import AppError from "../utils/appError.util.js";

export const catchAll = (req, res, next) => {
  throw new AppError(`Endpoint not found`, 404);
}