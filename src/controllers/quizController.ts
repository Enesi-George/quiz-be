import {
  AuthenticatedRequest,
  QuizQuestion,
  QuizStartResponse,
  QuizSubmissionRequest,
  QuizSubmissionResponse,
} from "../types";
import { Request, Response } from "express";
import { pool } from "../config/database";
import { submitQuizSchema } from "../validation/schemasValidation";

export const getAllQuizzesWithNoAnswer = async (
  req: AuthenticatedRequest,
  res: Response<QuizStartResponse | { error: string }>
) => {
  try {
    const result = await pool.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d, created_by, created_at, updated_at FROM quiz_questions ORDER BY RANDOM() LIMIT 10`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No questions available" });
    }

    res.status(200).json({
      questions: result.rows,
    });
  } catch (error) {
    console.error("Error fetching quiz questions: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const submitQuizAnswers = async (
  req: Request & { user?: { userId: number } },
  res: Response<QuizSubmissionResponse | { error: string }>
) => {
  try {
    const userId = req.user?.userId; // Optional for unauthenticated users

    const { error, value } = submitQuizSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { answers, time_taken } = value as QuizSubmissionRequest;
    if (answers.length === 0) {
      return res.status(400).json({ error: "Answers array cannot be empty" });
    }
    const questionIds = answers.map((a) => a.question_id);

    const questionResult = await pool.query(
      `SELECT id, correct_answer FROM quiz_questions WHERE id = ANY($1)`,
      [questionIds]
    );

    if (questionResult.rows.length !== questionIds.length) {
      return res
        .status(400)
        .json({ error: "One or more question IDs are invalid" });
    }
    let correctAnswersCount = 0;
    const results = answers.map((answer) => {
      const question = questionResult.rows.find(
        (q: QuizQuestion) => q.id === answer.question_id
      );
      const is_correct = question
        ? question.correct_answer === answer.selected_answer
        : false;
      if (is_correct) correctAnswersCount++;
      return {
        question_id: answer.question_id,
        selected_answer: answer.selected_answer,
        correct_answer: question ? question.correct_answer : null,
        is_correct,
      };
    });
    const totalQuestions = answers.length;
    const score = totalQuestions
      ? Math.round((correctAnswersCount / totalQuestions) * 100)
      : 0;

    // Save results with user_id as NULL for unauthenticated users
    await pool.query(
      `
    INSERT INTO quiz_results (user_id, total_questions, correct_answers, score, time_taken)
    VALUES ($1, $2, $3, $4, $5)
  `,
      [userId || null, totalQuestions, correctAnswersCount, score, time_taken]
    );

    res.status(200).json({
      total_questions: totalQuestions,
      correct_answers: correctAnswersCount,
      score,
      time_taken,
      results,
    });

  } catch (error) {
    console.error("Error submitting quiz answers: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserQuizHistory = async(req: AuthenticatedRequest, res: Response)=>{
try {
  if(!req.user){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.userId;
  const result = await pool.query(`SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY time_taken DESC`, [userId]);
  if(result.rows.length === 0){
    return res.status(404).json({ error: 'No quiz history found' });
  }
  res.status(200).json(result.rows);  
} catch (error) {
  console.error('Error fetching quiz history: ', error); 
  res.status(500).json({ error: 'Internal server error' });
  
}
}