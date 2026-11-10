import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Role, ROLES_KEY } from "../decorators/roles.decorator";
import { MembershipsService } from "../../memberships/memberships.service";
import { BusinessRole } from "../enums";

interface AuthUser {
  sub?: string;
  id?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipsService: MembershipsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser | undefined;
    const rawId = request.params.businessId ?? request.params.id;
    const businessId = Array.isArray(rawId) ? rawId[0] : rawId;

    const userId = user?.sub ?? user?.id;
    if (!userId) {
      throw new UnauthorizedException("User not authenticated");
    }

    if (!businessId) {
      throw new ForbiddenException(
        "Business context is required for this action",
      );
    }

    const effectiveRole = await this.membershipsService.getUserBusinessRole(
      userId,
      businessId,
    );

    if (!effectiveRole) {
      throw new ForbiddenException(
        "You do not have a role assigned for this business",
      );
    }

    if (!requiredRoles.includes(effectiveRole as BusinessRole)) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredRoles.join(", ")}]. Your role: ${effectiveRole}`,
      );
    }

    return true;
  }
}
