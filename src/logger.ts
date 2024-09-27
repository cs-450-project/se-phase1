/**
 * @file logger.ts
 * @description This file sets up the logging configuration using the pino library. It supports different log levels and can log to a file or the console based on environment variables.
 */

import { pino } from 'pino';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @constant {string[]} logLevels - Array of log levels based on project requirements.
 * @description Log levels: 0: silent, 1: info, 2: debug, 3: error
 */
const logLevels = ['silent', 'info', 'debug', 'error'];

/**
 * @constant {string} level - The log level determined from the environment variable, defaults to 'info'.
 */
const level: string = process.env.LOG_LEVEL ? logLevels[parseInt(process.env.LOG_LEVEL)] : 'info';

/**
 * @constant {string} logFilePath - The log file path determined from the environment variable. If empty, logs go to the console.
 */
const logFilePath: string = process.env.LOG_FILE || '';  // Empty means no file, logs go to console

/**
 * @constant {pino.Logger} logger - The pino logger instance configured with the determined log level and log file path.
 */
const logger = pino(
  {
    level: level,
  },
  pino.destination({
    dest: logFilePath, // Log file path
    sync: false,       // Asynchronous logging for better performance
  })
);

export default logger;
