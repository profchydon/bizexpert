import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Logging interceptor.
 *
 * Logs incoming request metadata and the resulting response status + duration
 * for every HTTP request that passes through the application.
 *
 * Output format (one line per request):
 *   → [METHOD] /path
 *   ← [METHOD] /path 200 - 42ms
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;
    const userAgent = request.headers['user-agent'] ?? '-';
    const clientIp =
      (request.headers['x-forwarded-for'] as string) ??
      request.socket.remoteAddress ??
      '-';

    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} [${clientIp}] "${userAgent}"`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `← ${method} ${url} ${response.statusCode} - ${duration}ms`,
          );
        },
        error: (err: Error) => {
          const duration = Date.now() - startTime;
          this.logger.warn(
            `← ${method} ${url} ERROR - ${duration}ms | ${err.message}`,
          );
        },
      }),
    );
  }
}
