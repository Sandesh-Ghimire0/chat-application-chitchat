import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import prisma from "../config/db.js";
import type { User } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

interface AuthPayload extends JwtPayload {
    id: string;
    email: string;
}

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unthorized Access :: Token not available");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthPayload;
        if (!decoded?.email) {
            throw new ApiError(401, "Unthorized Access :: Invalid Token");
        }
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            omit: { password: true },
        });
        (req as any).user = user;
        next();
    } catch {
        res.status(401).json({
            message: "Unthorized access :: Invalid or expired token",
        });
    }
});
