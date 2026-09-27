import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

interface RequestValidationSchema {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export const validate = (schema: RequestValidationSchema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schema.params) {
                req.params = (await schema.params.parseAsync(
                    req.params,
                )) as typeof req.params;
            }

            if (schema.query) {
                const parsedQuery = await schema.query.parseAsync(req.query);
                Object.defineProperty(req, "query", {
                    value: parsedQuery,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }

            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
