import { Inject, Injectable, Logger } from '@nestjs/common';
import { LogRecord } from './models/log-record.model';
import { LOGGING_REPOSITORY } from 'src/constants';

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

/**
 * Centralized logging service for persisting logs to the database.
 * Supports debug, info, warn, and error levels, with structured fields.
 */
@Injectable()
export class LoggingService {
  private logger: Logger;

  constructor(
    @Inject(LOGGING_REPOSITORY)
    private readonly logRepo: typeof LogRecord,
  ) {
    /** Logger instance scoped to LoggingService for tracking and recording service-level operations and errors. */
    this.logger = new Logger(LoggingService.name);
  }

  /** Generic method for handling log record creation.
   * @param service - The name of the service generating the log.
   * @param error - Optional brief error description or label.
   * @param message - Optional detailed message or context.
   */
  private async logWithLevel(
    level: LogLevel,
    service: string,
    error?: string,
    message?: string,
  ) {
    try {
      await this.logRepo.create({ level, service, error, message });
    } catch (e: any) {
      this.logger.error(
        'Failed to create log record',
        e?.message ?? JSON.stringify(e),
      );
    }
  }

  /**
   * Creates a debug-level log entry.
   * @param service - The name of the service generating the log.
   * @param error - Optional brief error description or label.
   * @param message - Optional detailed message or context.
   */
  async debug(service: string, error?: string, message?: string) {
    return this.logWithLevel(LogLevel.Debug, service, error, message);
  }

  /**
   * Creates an info-level log entry.
   * @param service - The name of the service generating the log.
   * @param error - Optional brief error description or label.
   * @param message - Optional detailed message or context.
   */
  async info(service: string, error?: string, message?: string) {
    return this.logWithLevel(LogLevel.Info, service, error, message);
  }

  /**
   * Creates a warn-level log entry.
   * @param service - The name of the service generating the log.
   * @param error - Optional brief error description or label.
   * @param message - Optional detailed message or context.
   */
  async warn(service: string, error?: string, message?: string) {
    return this.logWithLevel(LogLevel.Warn, service, error, message);
  }

  /**
   * Creates an error-level log entry.
   * @param service - The name of the service generating the log.
   * @param error - Optional brief error description or label.
   * @param message - Optional detailed message or context.
   */
  async error(service: string, error?: string, message?: string) {
    // TODO(RV): Consider emailing platform admins if an error level event occurs
    return this.logWithLevel(LogLevel.Error, service, error, message);
  }
}
