import { Request } from "express";


export interface User{
    id: number;
    full_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}
export interface QuizQuestion{
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: 'A' | 'B' | 'C' | 'D';
    created_at: Date;
    updated_at: Date;
}

export interface QuizResult{
    id: number;
    user_id: number;
    score: number;
    total_questions: number;
    created_at: Date;
    updated_at: Date;
    completed_at: Date;
}

export interface RegisterRequest{
    full_name: string;
    email: string;
    password: string;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface AuthResponse{
    token: string;
    user: User;
}
export interface CreateQuizResultRequest{
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface  QuizSubmissionResponse{
  total_questions: number;
  correct_answers: number;
  score: number;
  time_taken: string;
  results: Array<{
    question_id: number;
    selected_answer: 'A' | 'B' | 'C' | 'D';
    correct_answer: 'A' | 'B' | 'C' | 'D';
    is_correct: boolean;
  }>;
}

export interface QuizSubmissionRequest{
  answers: Array<{
    question_id: number;
    selected_answer: 'A' | 'B' | 'C' | 'D';
  }>;
  time_taken: string;
}

export interface QuizStartResponse {
  questions: Omit<QuizQuestion, 'correct_answer' | 'created_by'>[];
}

//JWT payload interface
export interface JwtPayload{
    userId: number;
    email: string;
    iat: number;
    exp: number;
}

export interface AuthenticatedRequest extends Request{
    user?: JwtPayload;
}