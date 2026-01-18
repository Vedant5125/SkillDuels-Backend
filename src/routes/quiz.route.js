import express from 'express';
const router = express.Router();
import { getBattleQuestions, addQuestion } from "../controllers/quizcontroller.js";

// When the game starts, call this to get the 5 questions
router.get('/start-battle', getBattleQuestions);

// Admin uses this to add questions
router.post('/add', addQuestion);

export default router;
