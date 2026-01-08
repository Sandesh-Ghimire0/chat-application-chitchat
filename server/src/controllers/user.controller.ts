import type { Request, Response } from "express";
import prisma from "../config/db.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getFriends = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const friends = await prisma.user.findMany({
        where: {
            id: {
                not: userId as string,
            },
        },

        omit: {
            password: true,
        },
    });

    if (!friends) {
        throw new ApiError(
            501,
            "Something went wrong while retrieving friends....!!!"
        );
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, friends, "Friends retrieved successfull.!!!")
        );
});

const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const messages = await prisma.message.findMany({
        where: {
            OR: [{ from: userId as string }, { to: userId as string }],
        },
    });

    if (!messages) {
        throw new ApiError(
            501,
            "Something went wrong while retrieving messages....!!!"
        );
    }

    return res.status(200).json();
});

export { getFriends, getMessages };
