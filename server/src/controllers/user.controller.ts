import type { Request, Response } from "express";
import { messages, users } from "../data/data.js";

const getFriends = (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(401).json({
            message: "userId is required",
        });
    }

    // remover user with userId at first using filter and than  return transform object using map
    const friends = users
        .filter((user) => user.id !== userId)
        .map((user) => ({
            id: user.id,
            username: user.username,
            isActive: user.isActive,
            image: user.image,
        }));

    return res.status(200).json({
        data: friends,
    });
};

const getMessages = (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(401).json({
            message: "userId is required",
        });
    }

    const msgs = messages.filter(
        (msg) => msg.userId === userId || msg.to === userId
    );

    return res.status(200).json({
        data: msgs,
    });
};

export { getFriends, getMessages };
