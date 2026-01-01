import type { Request, Response } from "express";
import { users } from "../data/data.js";

const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = users.find( u => u.email === email)

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    if(user.password !== password){
        return res.status(401).json({
            message:"Incorrect password"
        })
    }

    return res.status(200).json({
        id: user.id,
        username: user.username,
        image: user.image,
        token: "jdfkjdf-jfdkdjfkf",
    });
};

export { login };
