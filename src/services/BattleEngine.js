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
      const speedBonus = Math.max(0, 10 - (timeTaken / 1000));
      player.score += Math.round(10 + speedBonus); 
    }
    
    return { 
      currentScore: player.score, 
      opponentId: Object.keys(match.players).find(id => id !== userId) 
    };
  }

  // NEW METHOD: Calculate the winner
  getFinalResults(matchId) {
    const match = this.activeMatches.get(matchId);
    if (!match) return null;

    const playerIds = Object.keys(match.players);
    const p1 = match.players[playerIds[0]];
    const p2 = match.players[playerIds[1]];

    let winnerId = null;
    if (p1.score > p2.score) winnerId = playerIds[0];
    else if (p2.score > p1.score) winnerId = playerIds[1];
    else winnerId = "draw"; // It's a tie

    return {
        winnerId,
        p1: { id: playerIds[0], score: p1.score },
        p2: { id: playerIds[1], score: p2.score }
    };
  }
}

export default new BattleEngine();