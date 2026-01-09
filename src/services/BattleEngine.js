// services/BattleEngine.js
class BattleEngine {
  constructor() {
    this.activeMatches = new Map();
  }

  initializeMatch(matchId, p1Id, p2Id, quizData) {
    this.activeMatches.set(matchId, {
      players: {
        [p1Id]: { score: 0, completed: false },
        [p2Id]: { score: 0, completed: false }
      },
      quizData,
      startTime: Date.now()
    });
  }

  processSubmission(matchId, userId, isCorrect, timeTaken) {
    const match = this.activeMatches.get(matchId);
    if (!match) return null;

    const player = match.players[userId];
    if (isCorrect) {
      // Logic: Faster answers yield speed bonuses
      const speedBonus = Math.max(0, 10 - (timeTaken / 1000));
      player.score += Math.round(10 + speedBonus); 
    }
    
    return { 
      currentScore: player.score, 
      opponentId: Object.keys(match.players).find(id => id !== userId) 
    };
  }
}

// Export as a singleton instance
export default new BattleEngine();