import { Router } from "express";
import { getFriends } from "../controllers/user.controller.js";

export const userRouter = Router()

userRouter.route('/friends').get(getFriends)

