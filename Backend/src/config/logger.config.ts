import winston, { Logger, LogEntry , Logform} from 'winston';

// Define log levels and their corresponding colors
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
  },
};

winston.addColors(logLevels.colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info: Logform.TransformableInfo) => {

    const { timestamp, level, message } = info as { timestamp: string; level: string; message: string };
    return `${timestamp} [${level}]: ${message}`;
  })
);

const logger: Logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), 
        logFormat
      ),
      level: 'debug', 
    }),


    new winston.transports.File({
      filename: 'logs/app.log', 
      level: 'info', 
      format: logFormat,
    }),
  ],
});

// Export the logger
export default logger;
