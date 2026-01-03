import type { Request, Response } from "express";
import { users, type User } from "../data/data.js";
import { createJWT } from "../utils/createJWT.js";

const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    if (user.password !== password) {
        return res.status(401).json({
            message: "Incorrect password",
        });
    }

    const token = createJWT({ id: user.id, email });

    return res.status(200).json({
        id: user.id,
        username: user.username,
        image: user.image,
        token,
    });
};

const me = (req: Request, res: Response) => {
    const { email } = (req as any).user;
    const { id, username, image } = users.find(
        (u) => u.email === email
    ) as User;

    if (!id) {
        return res.status(401).json({
            message: "Invalid email /me",
        });
    }

    return res.status(200).json({ id, username, image });
};

export { login, me };
