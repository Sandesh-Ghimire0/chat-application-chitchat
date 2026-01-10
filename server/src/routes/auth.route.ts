import { Router } from "express";
import { login, me, signUp } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middelewares/auth.middleware.js";
import { upload } from "../middelewares/multer.middleware.js";

export const authRouter = Router();

authRouter.route("/login").post(login);
authRouter.route("/signup").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    signUp
);
authRouter.route("/me").get(verifyJWT, me);
