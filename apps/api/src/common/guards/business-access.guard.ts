import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { MembershipsService } from '../../memberships/memberships.service';

interface AuthUser {
  sub?: string;
  id?: string;
}

@Injectable()
export class BusinessAccessGuard implements CanActivate {
  constructor(private readonly membershipsService: MembershipsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser | undefined;
    const raw = request.params.businessId;
    const businessId = Array.isArray(raw) ? raw[0] : raw;

    if (!businessId) {
      return true;
    }

    const userId = user?.sub ?? user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const allowed = await this.membershipsService.checkBusinessAccess(
      userId,
      businessId,
    );
    if (!allowed) {
      throw new ForbiddenException('You do not have access to this business');
    }

    return true;
  }
}
