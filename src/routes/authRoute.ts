import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getAllQuizzesWithNoAnswer, submitQuizAnswers, getUserQuizHistory } from "../controllers/quizController";
import {getQuizQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion, getAllQuestionsForManagement} from '../controllers/quizQuestionsController';

const router = Router()
router.use(authenticateToken)

//Quiz Question routes
router.get("/questions", getAllQuestionsForManagement);
router.post("/questions", createQuizQuestion);
router.put("/questions/:id", updateQuizQuestion);
router.delete("/questions/:id", deleteQuizQuestion);


// Quiz routes (authenticated)
router.get("/quiz/history", getUserQuizHistory);

export default router; 
