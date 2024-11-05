import { createLogger, transports, format } from "winston";

// Create a Winston logger instance
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "combined.log" }), // Log all requests to a file
  ],
});

// Logger middleware
const loggerMiddleware = (req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
};

export default loggerMiddleware;
