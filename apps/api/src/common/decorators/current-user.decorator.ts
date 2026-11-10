import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extracts the authenticated user object from the request.
 *
 * @example
 * async getProfile(@CurrentUser() user: JwtPayload) { ... }
 * async getProfile(@CurrentUser('id') userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as Record<string, unknown>;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
