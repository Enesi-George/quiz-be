import Joi from "joi";

export const registerSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createQuizQuestionSchema = Joi.object({
  question_text: Joi.string().min(5).required(),
  option_a: Joi.string().min(1).required(),
  option_b: Joi.string().min(1).required(),
  option_c: Joi.string().min(1).required(),
  option_d: Joi.string().min(1).required(),
  correct_answer: Joi.string().valid("A", "B", "C", "D").required(),
});

export const updateQuestionSchema = createQuizQuestionSchema;

export const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        question_id: Joi.number().required(),
        selected_answer: Joi.string().valid("A", "B", "C", "D").required(),
      })
    )
    .min(1)
    .required(),
  time_taken: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
});
