import type { Request, Response } from "express";
import { users } from "../data/data.js";

import { createJWT } from "../utils/createJWT.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";

const signUp = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageLocalPath = files?.image?.[0]?.path;

    if (!email || !username || !password) {
        throw new ApiError(400, "Missing email, username or password");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    let imageUrl: string;
    if (imageLocalPath) {
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
        imageUrl =
            cloudinaryResponse?.secure_url ??
            "https://res.cloudinary.com/dkwy8fx8o/image/upload/v1768022719/profile_fxdqfj.png";
    } else {
        imageUrl =
            "https://res.cloudinary.com/dkwy8fx8o/image/upload/v1768022719/profile_fxdqfj.png"; // default image path
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            image: imageUrl,
        },
        select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(201).json(
        new ApiResponse(201, newUser, "User created Successfully...!!!")
    );
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "missing email or password");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(400, "user does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Password is incorrect");
    }

    const token = createJWT({ id: user.id, email });
    res.status(200).json(
        new ApiResponse(
            200,
            {
                ...user,
                token,
            },
            "User logged In successfully"
        )
    );
});

const me = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user) {
        throw new ApiError(401, "Unauthorized Access");
    }

    return res.status(200).json(new ApiResponse(200, user));
});

export { login, me, signUp };
