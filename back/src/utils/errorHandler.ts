import { Response } from 'express';
import logger from '../config/logger';

const sendErrorResponse = (res: Response, statusCode: number, message: string, details:string|null = null) => {
  logger.error(message);
  return res.status(statusCode).json({ error: details || message });
};

export default sendErrorResponse;
