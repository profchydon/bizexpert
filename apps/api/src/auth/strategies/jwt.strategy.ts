import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  /** Subject – the authenticated user's UUID */
  sub: string;
  email: string;
  /** All business IDs the user belongs to */
  businessIds: string[];
}

/**
 * Passport JWT strategy.
 *
 * Extracts the bearer token from the `Authorization` header, verifies the
 * signature with `JWT_SECRET`, and attaches the decoded payload to `req.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * The return value is set as `req.user` on the incoming request.
   * We expose both the raw payload fields and a convenience `id` alias.
   */
  validate(payload: JwtPayload): JwtPayload & { id: string } {
    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      businessIds: payload.businessIds,
    };
  }
}
