import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
        return;
    }
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
//# sourceMappingURL=errorHandler.js.map