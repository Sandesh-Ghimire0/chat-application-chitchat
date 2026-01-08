import { Router } from "express";
import { getFriends,getMessages } from "../controllers/user.controller.js";
import { verifyJWT } from "../middelewares/auth.middleware.js";

export const userRouter = Router()

userRouter.route('/friends').get(verifyJWT, getFriends)
userRouter.route('/messages').get(verifyJWT, getMessages)

