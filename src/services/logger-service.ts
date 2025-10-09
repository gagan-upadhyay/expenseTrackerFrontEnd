// services/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file'; // For file rotation

const getLogger = (filename: string): winston.Logger => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  if (process.env.CLIENT_MODE === 'development') {
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `logs/%DATE%-${filename}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      })
    );
  }

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json() // For production, JSON format is often preferred
    ),
    transports,
  });
};

export default getLogger;