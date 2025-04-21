import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_MESSAGES } from "../constants/messages";
import logger from "../config/logger";

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
    logger.error(JWT_MESSAGES.VERIFICATION_FAILED, error);
    res.status(401).json({ message: JWT_MESSAGES.INVALID_TOKEN });
  }
};

export const isAuthenticated = (req: Request, res: Response) => {
  const token = req.cookies.token
  const { userId } = req.params
  if (!token) {
    return res.status(401).json({ isAuth: false, message: JWT_MESSAGES.TOKEN_MISSING });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    if (decoded.userId != userId) return res.status(401).json({ message: JWT_MESSAGES.UNAUTHORIZED })
    return res.json({ isAuth: true })
  } catch (error) {
    logger.error(JWT_MESSAGES.VERIFICATION_FAILED, error);
    return res.status(401).json({ isAuth: false, message: JWT_MESSAGES.INVALID_TOKEN });
  }
};

