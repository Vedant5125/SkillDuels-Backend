import User from "../models/user.model.js";

const updatePlayerStats = async (results) => {
    const { winnerId, p1, p2 } = results;

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