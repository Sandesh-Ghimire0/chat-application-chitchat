import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middelewares/auth.middleware.js";

export const authRouter = Router()

authRouter.route('/login').post(login)
authRouter.route('/me').get(verifyJWT, me)