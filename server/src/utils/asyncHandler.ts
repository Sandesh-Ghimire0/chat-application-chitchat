import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
    (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message,
            });
        }
    };

export { asyncHandler };
