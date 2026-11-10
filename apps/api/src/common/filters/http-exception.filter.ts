import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Global HTTP exception filter.
 *
 * Catches all HttpExceptions (and unexpected errors) and formats them into a
 * consistent JSON error envelope:
 * {
 *   statusCode, error, message, path, method, timestamp, requestId?
 * }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string | string[];
    let errorName: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorName = exception.name;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp['message'] as string | string[]) ?? exception.message;
        errorName = (resp['error'] as string) ?? exception.name;
      } else {
        message = exception.message;
        errorName = exception.name;
      }
    } else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorName = 'InternalServerError';

      // Log the full stack trace for unexpected errors
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
        'HttpExceptionFilter',
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      errorName = 'InternalServerError';

      this.logger.error(
        `Unhandled non-Error exception: ${JSON.stringify(exception)}`,
        undefined,
        'HttpExceptionFilter',
      );
    }

    // Log 4xx as warnings, 5xx as errors
    const logLevel = statusCode >= 500 ? 'error' : 'warn';
    this.logger[logLevel](
      `${request.method} ${request.url} → ${statusCode}: ${
        Array.isArray(message) ? message.join('; ') : message
      }`,
      'HttpExceptionFilter',
    );

    const errorBody: ErrorResponse = {
      statusCode,
      error: errorName,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    // Attach X-Request-Id header if present (e.g., set by a reverse proxy)
    const requestId = request.headers['x-request-id'];
    if (requestId && typeof requestId === 'string') {
      errorBody.requestId = requestId;
    }

    response.status(statusCode).json(errorBody);
  }
}
