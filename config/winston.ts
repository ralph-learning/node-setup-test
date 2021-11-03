import winston from "winston"

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

const logger = winston.createLogger({
  level: level(),
  format,
  transports,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;
