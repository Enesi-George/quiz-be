import { AuthenticatedRequest, JwtPayload } from "../types";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): 
void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if(!jwtSecret) {
    res.status(500).json({ message: 'JWT secret not configured' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  }catch (error) {
    if (error instanceof jwt.TokenExpiredError){
      res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError){
      res.status(401).json({ message: 'Invalid token' });
    } else {
      console.log('Token verification failed : ', error )
      res.status(500).json({ message: 'Token verification failed' });
    }
  }
}