import express from 'express';
const router = express.Router();
const { getBattleQuestions, addQuestion } = require('../controllers/quizController');

// When the game starts, call this to get the 5 questions
router.get('/start-battle', getBattleQuestions);

// Admin uses this to add questions
router.post('/add', addQuestion);

module.exports = router;
