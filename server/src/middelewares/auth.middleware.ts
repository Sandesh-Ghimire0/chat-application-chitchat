import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unthorized Access :: Token not available",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Unthorized access :: Invalid or expired token" });
    }
};
