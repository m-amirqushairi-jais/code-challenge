import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validated = schema.parse(req[source]);
            req[source] = validated as any;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errors,
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error during validation',
            });
        }
    };
};