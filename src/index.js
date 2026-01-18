import { app } from "./app.js";
import connectDB from "./db/server.js";
import http from "http";
import { Server } from "socket.io";
import battleHandler from "./socket/battleHandler.js";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
        if (!token) return next(new Error("Authentication error"));

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        
        if (!user) return next(new Error("User not found"));
        
        socket.user = user; // Attach user to the socket
        next();
    } catch (err) {
        next(new Error("Authentication failed"));
    }
});

// 3. Connect the Battle Handler
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Pass io and socket to your battle logic
    battleHandler(io, socket);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// 4. Connect DB and then Start Server
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server & Socket running at port : ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    });