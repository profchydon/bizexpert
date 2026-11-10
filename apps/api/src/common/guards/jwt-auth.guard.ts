import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * JWT authentication guard.
 *
 * Extends Passport's AuthGuard('jwt') to:
 * - Allow routes decorated with @Public() to bypass authentication.
 * - Return a descriptive UnauthorizedException for missing / invalid tokens.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route or controller is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | false,
    info: { message?: string } | null,
  ): TUser {
    if (err || !user) {
      const message =
        err?.message ??
        info?.message ??
        'No auth token provided or token is invalid';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
