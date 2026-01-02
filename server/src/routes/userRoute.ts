import { Router } from "express";
import { getFriends,getMessages } from "../controllers/user.controller.js";

export const userRouter = Router()

userRouter.route('/friends').get(getFriends)
userRouter.route('/messages').get(getMessages)

