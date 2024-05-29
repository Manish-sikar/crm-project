const winston = require("winston");
const path = require("path");
require("winston-daily-rotate-file");

const dashLog = new winston.transports.DailyRotateFile({
  filename: "./logs/log-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add a formatted timestamp to each log entry
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [dashLog],
  exitOnError: false, // Continue logging even if an error occurs
});

// Handle uncaught exceptions
process.on("uncaughtException", (ex) => {
  logger.error(`Uncaught exception: ${ex.message}`, { error: ex });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Rejection at:", error);
});

if (process.env.DEBUG === "true") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
        winston.format.simple(),
        winston.format.printf(({ level, message, label, timestamp, stack }) => {
          const localTime = new Date(timestamp).toLocaleString(); // Convert UTC timestamp to local time
          return `${localTime} [${level}]: ${message} `; // Add a closing square bracket after 'level'
        })
      ),
    })
  );
}

module.exports = logger;
