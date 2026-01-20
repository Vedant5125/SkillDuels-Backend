// services/BattleEngine.js
class BattleEngine {
  constructor() {
    this.activeMatches = new Map();
  }


  initializeMatch(matchId, p1Id, p2Id, quizData, category) { // 1. Accept category
    this.activeMatches.set(matchId, {
        players: {
            [p1Id.toString()]: { score: 0 },
            [p2Id.toString()]: { score: 0 }
        },
        quizData,
        category // 2. Store category
    });
}

  // services/BattleEngine.js
  processSubmission(matchId, userId, isCorrect, timeTaken) {
    const match = this.activeMatches.get(matchId);
    if (!match) {
        console.error(`Match ${matchId} not found`);
        return null;
    }

    const player = match.players[userId];
    if (!player) {
        console.error(`User ${userId} not found in match ${matchId}. Available:`, Object.keys(match.players));
        return null;
    }

    if (isCorrect) {
        // timeTaken comes from frontend as (15 - timeLeft) * 1000
        // We normalize speedBonus based on your 10-second logic
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
        p2: { id: playerIds[1], score: p2.score },
        category: match.category
    };
  }
}

export default new BattleEngine();

