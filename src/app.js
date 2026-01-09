import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
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

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());


export { app };