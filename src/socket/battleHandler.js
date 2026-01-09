// socket/battleHandler.js
import BattleEngine from '../services/BattleEngine.js';
import QueueManager from '../services/QueueManager.js';
import Quiz from '../models/Quiz.js'; // As requested

export default (io, socket) => {
  // 1. joinQueue: User enters a category pool
  socket.on('joinQueue', async ({ category }) => {
    const opponent = QueueManager.addToQueue(category, socket.id, socket.userId);
    
    if (opponent) {
      const matchId = `match_${Date.now()}`;
      
      // Fetching specific quiz data from MongoDB
      const quizData = await Quiz.find({ category }).limit(20);
      
      // 2. matchFound: Pair players and send data
      io.to(socket.id).to(opponent.socketId).emit('matchFound', { matchId, quizData });
      
      BattleEngine.initializeMatch(matchId, socket.userId, opponent.userId, quizData);
      
      // 3. startTimer: Sync countdown
      io.to(matchId).emit('startTimer', { duration: 300 }); 
    }
  });

  // 4. submitAnswer: Server calculates accuracy and speed
  socket.on('submitAnswer', ({ matchId, isCorrect, timeTaken }) => {
    const result = BattleEngine.processSubmission(matchId, socket.userId, isCorrect, timeTaken);
    
    if (result) {
      // 5. liveUpdate: Push score to the opponent
      io.to(result.opponentId).emit('liveUpdate', { 
        opponentScore: result.currentScore 
      });
    }
  });

  // 6. endMatch: Declare winner and award badges/XP
  socket.on('endMatch', async ({ matchId }) => {
    const results = BattleEngine.getFinalResults(matchId);
    
    // Reward logic persists to MongoDB
    await RewardService.updatePlayerStats(results); 
    
    io.to(matchId).emit('endMatch', results);
    BattleEngine.activeMatches.delete(matchId);
  });
};