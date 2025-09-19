import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { getQuizQuestions } from "../controllers/quizQuestionsController";
import { submitQuizAnswers } from "../controllers/quizController";

const router = Router();

// Register
router.post("/register", registerUser);

// Login 
router.post("/login", loginUser);

// Public Quiz routes (no auth required)
router.get("/quiz/start", getQuizQuestions);
router.post("/quiz/submit", submitQuizAnswers);

export default router; 