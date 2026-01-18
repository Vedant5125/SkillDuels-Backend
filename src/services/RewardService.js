// services/RewardService.js
import User from "../models/user.model.js";

export const updatePlayerStats = async (results) => {
    const { winnerId, p1, p2 } = results;

    if (winnerId !== "draw") {
        // 1. Award XP to Winner
        await User.findByIdAndUpdate(winnerId, {
            $inc: { 
                xp: 50, 
                "stats.wins": 1,
                "stats.gamesPlayed": 1 
            }
        });

        // 2. Update Loser Stats
        const loserId = (winnerId === p1.id) ? p2.id : p1.id;
        await User.findByIdAndUpdate(loserId, {
            $inc: { 
                "stats.losses": 1,
                "stats.gamesPlayed": 1 
            }
        });
        
        await checkAndAwardBadges(winnerId);
    }
};

export const checkAndAwardBadges = async (userId) => {
    const user = await User.findById(userId);
    
    // Simple logic: If wins > 5, award "Warrior" badge
    if (user.stats.wins >= 5 && !user.badges.includes("Warrior")) {
        user.badges.push("Warrior");
        await user.save();
    }
};