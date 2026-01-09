// socket/battleHandler.js
const BattleEngine = require('../services/BattleEngine');
const QueueManager = require('../services/QueueManager');

module.exports = (io, socket) => {
  // 1. joinQueue: User enters a category pool
  socket.on('joinQueue', ({ category }) => {
    const opponent = QueueManager.addToQueue(category, socket.id, socket.userId);
    
    if (opponent) {
      // 2. matchFound: Pair players and send quiz data
      const matchId = `match_${Date.now()}`;
      const quizData = await QuizService.getQuestions(category);
      
      io.to(socket.id).to(opponent.socketId).emit('matchFound', { matchId, quizData });
      BattleEngine.initializeMatch(matchId, socket.userId, opponent.userId, quizData);
      
      // 3. startTimer: Sync countdown
      io.to(matchId).emit('startTimer', { duration: 300 }); // 5 min
    }
  });

  // 4. submitAnswer: Server calculates accuracy/speed
  socket.on('submitAnswer', ({ matchId, isCorrect, timeTaken }) => {
    const result = BattleEngine.processSubmission(matchId, socket.userId, isCorrect, timeTaken);
    
    if (result) {
      // 5. liveUpdate: Push score to the opponent
      io.to(result.opponentId).emit('liveUpdate', { 
        opponentScore: result.currentScore 
      });
    }
  });

  // 6. endMatch: Declare winner and update DB
  socket.on('endMatch', async ({ matchId }) => {
    const results = BattleEngine.getFinalResults(matchId);
    await RewardService.updatePlayerStats(results); // Updates XP/Badges in MongoDB
    io.to(matchId).emit('endMatch', results);
    BattleEngine.activeMatches.delete(matchId);
  });
};