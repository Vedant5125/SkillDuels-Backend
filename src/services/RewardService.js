import Battle from "../models/battle.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const updatePlayerStats = async (results) => {
    const { winnerId, p1, p2, category } = results;

    if (winnerId && winnerId !== "draw") {
        // 1. Award XP to Winner
        await User.findByIdAndUpdate(winnerId, {
            $inc: { 
                xp: 50, 
                "stats.wins": 1,
                "stats.gamesPlayed": 1 
            }
        });

        // 2. Update Loser Stats
        const loserId = (winnerId.toString() === p1.id.toString()) ? p2.id : p1.id;
        
        await User.findByIdAndUpdate(loserId, {
            $inc: { 
                "stats.losses": 1,
                "stats.gamesPlayed": 1 
            }
        });
        
        await checkAndAwardBadges(winnerId);
    } else if (winnerId === "draw") {
        // Optional: Handle draw (award small XP to both)
        await User.updateMany({ _id: { $in: [p1.id, p2.id] } }, {
            $inc: { "stats.gamesPlayed": 1, xp: 10 }
        });

    }
    
    try {
    // This creates the record your Profile page is looking for
        if (!p1.id || !p2.id) throw new Error("Missing Player IDs");

        const historyRecord = await Battle.create({
            players: [
                { user: new mongoose.Types.ObjectId(p1.id), score: p1.score },
                { user: new mongoose.Types.ObjectId(p2.id), score: p2.score }
            ],
            winner: winnerId === "draw" ? null : new mongoose.Types.ObjectId(winnerId),
            category: category || "General Knowledge", // Required field fallback
            status: "completed",
            xpAwarded: 50,
            playedAt: new Date()
        });
        console.log("✅ Battle saved to Atlas successfully", historyRecord._id);
    } catch (error) {
        console.error("❌ Atlas Save Error:", error.message);
    }
};

const checkAndAwardBadges = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;
    
    // Logic: If wins >= 5, award "Warrior" badge
    if (user.stats.wins >= 5 && !user.badges.includes("Warrior")) {
        user.badges.push("Warrior");
        await user.save();
    }
};

// Export as an object so "RewardService.updatePlayerStats" works
export default {
    updatePlayerStats,
    checkAndAwardBadges
};