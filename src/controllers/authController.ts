import { AuthResponse, RegisterRequest } from "../types"
import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/schemasValidation";
import { pool } from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/jwtUtils";

const JWT_EXPIRES_IN = '1h';
export const registerUser = async (req:Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse | {error: string}>) => {
  try{
    //Validate request body
    const{error, value} = registerSchema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }
    const { full_name, email, password } = value;
    //check if user already exists
    const userExist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if(userExist.rows.length > 0){
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at, updated_at',
      [full_name, email, passwordHash]
    );
    const user = result.rows[0];
      
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Error during user registration: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const loginUser = async (req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse | {error: string}>) => {
  try{
    const{error, value} = loginSchema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = value;
    //check if user already exists
    const userResult = await pool.query('SELECT id, full_name, email, password_hash, created_at, updated_at FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if(!user || !passwordMatch){
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN }
    );

    const{ password_hash, ...userWithoutPassword } = user;
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error during user login: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }

}

