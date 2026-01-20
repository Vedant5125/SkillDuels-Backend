// socket/battleHandler.js
import BattleEngine from '../services/BattleEngine.js';
import QueueManager from '../services/QueueManager.js';
import Quiz from '../models/quiz.model.js';
import RewardService from '../services/RewardService.js';

export default (io, socket) => {
  // 1. joinQueue: User enters a category pool

  socket.on('joinQueue', async (data) => {
    // 1. Debug Log: See what is actually arriving
    console.log("Full data received from client:", data);

    // 2. Safely extract data
    const category = data?.category;
    // const userId = data?.userId || socket.userId;
    const userId = (data?.userId || socket.userId)?.toString();
    socket.userId = userId;

    if (!category || !userId) {
      console.log(`Missing Data - Category: ${category}, User: ${userId}`);
      return;
    }

    console.log(`Processing: User ${userId} for ${category}`);
    
    const opponent = QueueManager.addToQueue(category, socket.id, userId);
    
    if (opponent) {
      console.log("Match Found logic executing...");
      
      const matchId = `match_${Date.now()}`;

      // 1. Force both sockets to join a specific Room
      socket.join(matchId);
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket) {
        opponentSocket.join(matchId);
      }

      // 2. Fetch quiz data (ensure category matches your DB)
      const quizData = await Quiz.find({ category }).limit(20);
      console.log(`Battle Ready: ${matchId} | Category: ${category} | Questions: ${quizData.length}`);
      

      // 3. Emit the event to the entire room (Both Players)
      io.to(matchId).emit('matchFound', { 
        matchId, 
        opponentId: opponent.userId, 
        quizData 
      });

      // 4. Initialize the engine for scoring
      BattleEngine.initializeMatch(matchId, userId, opponent.userId.toString(), quizData);
    }
  });

  socket.on('submitAnswer', ({ matchId, isCorrect, timeTaken }) => {
      const userId = socket.userId?.toString();
      const result = BattleEngine.processSubmission(matchId, userId, isCorrect, timeTaken);
      
      if (result) {
          // We emit to the whole room so everyone gets the update
          io.to(matchId).emit('liveUpdate', { 
              playerId: userId, // The person who just answered
              score: result.currentScore 
          });
      }
  });

  // 6. endMatch: Declare winner and award badges/XP
  socket.on('endMatch', async ({ matchId }) => {
    const results = BattleEngine.getFinalResults(matchId);
    if (!results) return;

    await RewardService.updatePlayerStats(results); 
    
    // This sends the official winnerId, p1 score, and p2 score to everyone
    io.to(matchId).emit('matchEnded', results); 
  });
};
