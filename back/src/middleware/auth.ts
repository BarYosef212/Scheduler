import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_MESSAGES } from "../controllers/messages";

export const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token
  if (!token) {
    res.status(401).json({ message: JWT_MESSAGES.TOKEN_MISSING });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next(); 
  } catch (error) {
    console.error(JWT_MESSAGES.VERIFICATION_FAILED, error);
    res.status(401).json({ message: JWT_MESSAGES.INVALID_TOKEN});
  }
};

export const isAuthenticated = (req: Request, res: Response) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({isAuth:false, message: JWT_MESSAGES.TOKEN_MISSING });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return res.json({isAuth:true})
  } catch (error) {
    console.error(JWT_MESSAGES.VERIFICATION_FAILED, error);
    return res.status(401).json({isAuth:false, message: JWT_MESSAGES.INVALID_TOKEN });
  }
};

