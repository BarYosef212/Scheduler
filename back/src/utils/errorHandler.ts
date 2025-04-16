import { Response } from 'express';
import logger from '../config/logger';

const sendErrorResponse = (res: Response, statusCode: number, message: string, details = null) => {
  logger.error(message, details);
  return res.status(statusCode).json({ error: message });
};

export default sendErrorResponse;
