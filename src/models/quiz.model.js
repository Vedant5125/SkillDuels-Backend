import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ["technical", "aptitude", "logical", "other"],
    },
    questionText: { 
        type: String, 
        required: true
    },
    options: [{ 
        type: String, 
        required: true 
    }],
    correctAnswer: { 
        type: String, 
        required: true 
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
});

const Quiz = mongoose.model("Quiz", quizSchema)
export default Quiz;
