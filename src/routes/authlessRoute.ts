// import { Router } from "express";
// import { loginUser, registerUser } from "../controllers/authController";
import { getQuizQuestions } from "../controllers/quizQuestionsController";
// import { submitQuizAnswers } from "../controllers/quizController";

// const router = Router();

// // Register
// router.post("/register", registerUser);

// // Login 
// router.post("/login", loginUser);

// // Public Quiz routes (no auth required)
// router.get("/quiz/start", getQuizQuestions);
// router.post("/quiz/submit", submitQuizAnswers);

// export default router; 

import { Router } from "express";
// Comment out the controller imports temporarily
// import { loginUser, registerUser } from "../controllers/authController";
// import { getQuizQuestions } from "../controllers/quizQuestionsController";
// import { submitQuizAnswers } from "../controllers/quizController";

const router = Router();

// Simple test functions instead of controllers
router.post("/register", (req, res) => {
  console.log('Register route hit');
  res.json({ 
    message: 'Register test endpoint working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

router.post("/login", (req, res) => {
  console.log('Login route hit');
  res.json({ 
    message: 'Login test endpoint working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

router.get("/quiz/start", async (req, res) => {
  try {
    console.log('Testing getQuizQuestions controller');
    await getQuizQuestions(req, res);
  } catch (error:any) {
    console.error('getQuizQuestions error:', error);
    res.status(500).json({ 
      error: 'Controller error',
      message: error.message,
      stack: error.stack 
    });
  }
});

router.post("/quiz/submit", (req, res) => {
  console.log('Quiz submit route hit');
  res.json({ 
    message: 'Quiz submit test endpoint working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

export default router;