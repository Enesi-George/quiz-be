import { AuthenticatedRequest, QuizQuestion } from "../types";
import { Request, Response } from "express";
import { pool } from "../config/database";
import { createQuizQuestionSchema, updateQuestionSchema } from "../validation/schemasValidation";

export const getQuizQuestions = async (req: Request, res: Response<QuizQuestion[] | {error: string}>) => {
  try {
    const result = await pool.query(`SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.created_by, q.created_at 
      FROM quiz_questions q 
      ORDER BY RANDOM() LIMIT 10`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log('Error fetching quiz questions: ', err);
    res.status(500).json({ error: 'Internal server error' });
  } 
};

// Get all questions with correct answers for management (authenticated)
export const getAllQuestionsForManagement = async (req: AuthenticatedRequest, res: Response<QuizQuestion[] | {error: string}>) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const result = await pool.query(`
      SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer, created_by, created_at, updated_at 
      FROM quiz_questions 
      ORDER BY created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching questions for management: ', err);
    res.status(500).json({ error: 'Internal server error' });
  } 
};

export const createQuizQuestion = async (req: AuthenticatedRequest, res: Response<QuizQuestion | { error: string }>) => {
  try{
    if(!req.user){
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {error, value} = createQuizQuestionSchema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }

  const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
  const userId = req.user?.userId;

  const result = await pool.query(`
    INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [question_text, option_a, option_b, option_c, option_d, correct_answer, userId]);

    res.status(201).json(result.rows[0]);

  } catch(error){
    console.log('Error while creating quiz question', error);
    res.status(500).json({error: 'Internal server error'});

  }

}


export const updateQuizQuestion = async (req: AuthenticatedRequest, res: Response<QuizQuestion | {error: string}>) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const questionId = parseInt(req.params.id);
    if (isNaN(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }

    const {error, value} = updateQuestionSchema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    const userId = req.user?.userId;
    const existingQuestion = await pool.query('SELECT id, created_by FROM quiz_questions WHERE id = $1', [questionId]);
    if (existingQuestion.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    if (existingQuestion.rows[0].created_by !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not Authorized to perform this action' });
    }
    const result = await pool.query(`
      UPDATE quiz_questions
      SET question_text = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_answer = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [question_text, option_a, option_b, option_c, option_d, correct_answer, questionId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating quiz question: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }  
}

export const deleteQuizQuestion = async (req: AuthenticatedRequest, res: Response<{ message: string } | { error: string }>) => {  
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    } 
    const questionId = parseInt(req.params.id);
    if (isNaN(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }
    const userId = req.user?.userId;
    const existingQuestion = await pool.query('SELECT id, created_by FROM quiz_questions WHERE id = $1', [questionId]);
    if (existingQuestion.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    if (existingQuestion.rows[0].created_by !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not Authorized to perform this action' });
    }
    await pool.query('DELETE FROM quiz_questions WHERE id = $1', [questionId]);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz question: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

