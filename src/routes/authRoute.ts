import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {createQuizQuestion, updateQuizQuestion, deleteQuizQuestion, getAllQuestionsForManagement} from '../controllers/quizQuestionsController';

const AuthRouter = Router()
AuthRouter.use(authenticateToken)

//Quiz Question routes
AuthRouter.get("/questions", getAllQuestionsForManagement);
AuthRouter.post("/questions", createQuizQuestion);
AuthRouter.put("/questions/:id", updateQuizQuestion);
AuthRouter.delete("/questions/:id", deleteQuizQuestion);


export default AuthRouter; 
