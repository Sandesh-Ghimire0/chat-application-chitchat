import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

export const authRouter = Router()

authRouter.route('/login').post(login)