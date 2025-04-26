import { Response } from 'express';
import logger from '../config/logger';
import HTTP from '../constants/status';

export const sendErrorResponse = (res: Response, statusCode: number, message: string, details: string | null = null) => {
  logger.error(details || message);
  return res.status(statusCode).json({ error: message });
};


export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}


export function catchFunc(error: Error, res: Response) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, HTTP.ReasonPhrases.INTERNAL_SERVER_ERROR, error.message);
}
