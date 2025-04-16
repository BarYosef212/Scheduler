import winston from 'winston';
import dayjs from 'dayjs';

const { combine, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = dayjs(timestamp as string).format('YYYY-MM-DD HH:mm:ss');
  return `${level}: ${message} - ${formattedTimestamp}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        winston.format.timestamp(),
        logFormat
      )
    }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;
