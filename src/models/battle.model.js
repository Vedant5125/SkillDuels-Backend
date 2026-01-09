const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
    players: [{ 
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        score: { 
            type: Number, 
            default: 0 
        }
    }],
    winner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    category: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'completed' 
    },
    xpAwarded: { 
        type: Number, 
        default: 0 
    },
    playedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Battle = mongoose.model("Battle", battleSchema)
export default Battle;