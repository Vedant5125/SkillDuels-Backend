import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],

    },
    role:{
        type: String,
        enum: ['player', 'host'],
        default: 'player',
    },
    xp: { 
        type: Number,
        default: 0
    },
    rank: { 
        type: String,
        default: 'Novice'
    },
    badges: [{ 
        type: String 
    }],
    stats: {
        gamesPlayed: 
        { 
            type: Number,
            default: 0
        },
        wins: { 
            type: Number, 
            default: 0 
        },
        losses: { 
            type: Number, 
            default: 0 
        }
    },
    refreshToken: {
        type: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})


userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};

const User = mongoose.model("User", userSchema)
export default User;