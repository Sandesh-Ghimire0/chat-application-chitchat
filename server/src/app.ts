import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

export const app = express();

app.get("/", (_, res) => {
    res.send("Server is running");
});

app.use(cors());
app.use(express.json());

//====================================================
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
