// services/RewardService.js
exports.updatePlayerStats = async (results) => {
  const { winnerId, loserId, winnerScore } = results;
  
  // Award XP based on win/loss and performance
  await User.findByIdAndUpdate(winnerId, { 
    $inc: { xp: 50 + (winnerScore * 0.1) } 
  });
  
  // Check for badge eligibility (e.g., "First Win")
  await this.checkAndAwardBadges(winnerId);
};