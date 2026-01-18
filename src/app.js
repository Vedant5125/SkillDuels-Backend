import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
});
// require('dotenv').config();

const app = express();

console.log("CORS_ORIGIN is:", process.env.CORS_ORIGIN);
app.use(cors({
    origin:(process.env.CORS_ORIGIN),
    credentials: true
}))

app.use(errorHandler);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.route.js"
app.use("/api/users", userRouter)

import quizRouter from "./routes/quiz.route.js"
app.use("/api/quiz", quizRouter)

import battleRouter from "./routes/battle.route.js";
app.use("/api/battles", battleRouter);


export { app };