import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

interface RequestValidationSchema {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export const validate = (schema: RequestValidationSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.params validation
            if (schema.params) {
                req.params = (await schema.params.parseAsync(
                    req.params,
                )) as typeof req.params;
            }

            // req.query validation
            if (schema.query) {
                res.locals.query = await schema.query.parseAsync(req.query);
            }

            // req.body validation
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
