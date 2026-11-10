import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extracts the `businessId` from the authenticated JWT payload on the request.
 *
 * Throws UnauthorizedException if no businessId is present.
 *
 * @example
 * async listProducts(@BusinessId() businessId: string) { ... }
 */
export const BusinessId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as Record<string, unknown> | undefined;

    if (!user) {
      throw new UnauthorizedException('No authenticated user found on request');
    }

    const businessId = user['businessId'] as string | undefined;

    if (!businessId) {
      throw new UnauthorizedException(
        'No businessId found in JWT payload. ' +
          'Ensure the token was issued with a business context.',
      );
    }

    return businessId;
  },
);
