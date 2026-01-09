import User from "../models/user.model.js";
import Battle from "../models/battle.model.js";
import Quiz from "../models/quiz.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found for token generation");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        
        return {accessToken, refreshToken};

    } catch (error) {
        console.error("Token Generation Error:", error.message);
        throw new Error("Internal Server Error: Token generation failed");
    }
}

const registerUser = async (req, res) => {
    const { email, password, fullname } = req.body;

    try {

        if ([fullname, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({ message: "User with email already exists" });
        }

        const user = await User.create({
            fullname,
            email,
            password,
            xp: 0,
            rank: "Novice"
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        return res.status(201).json({
            message: "User registered successfully",
            user: createdUser
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const validPassword = await user.isPasswordCorrect(password);
    if(!validPassword){
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({data: loggedInUser, accessToken, refreshToken, message: "User logged in successfully"});

}

const logoutUser = async (req, res) => {

    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            {
                message: "User logged out successfully"
            }
        )
    }
    catch (error) {
        return res.status(500).json({ 
            message: "Error during logout", 
            error: error.message 
        });
    }
}

const refreshAccessToken = async(req, res) =>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if(!incomingRefreshToken){
            return res.status(401).json({ message: "No refresh token provided" });
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
        if(!user){
            return res.status(401).json({ message: "Invalid refresh token - User not found" });
        }
    
        if(!(incomingRefreshToken === user?.refreshToken)){
            return res.status(401).json({ message: "Refresh token is expired or used" });
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            data: accessToken, newRefreshToken,
            message: "Access and refreshed "
        })
    } catch (error) {
        return res.status(401).json({ 
            message: error?.message || "Invalid refresh token" 
        });
    }
}

const getUser = async (req, res) =>{
    try {
        const user = await User.findById(req.user?._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUser
}