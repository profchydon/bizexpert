import { ForbiddenException, Injectable } from "@nestjs/common";
import { LocationMembership } from "@prisma/client";
import { BusinessRole } from "../common/enums";
import {
  canApproveStocktake,
  canBypassLocationPermissions,
} from "../common/role-access";
import { PrismaService } from "../prisma/prisma.service";

export type LocationPermission =
  "canSell" | "canReceiveStock" | "canTransferStock";

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserBusinessRole(
    userId: string,
    businessId: string,
  ): Promise<BusinessRole | null> {
    const m = await this.prisma.businessMembership.findFirst({
      where: { userId, businessId, isActive: true },
    });
    return (m?.role as BusinessRole) ?? null;
  }

  async checkBusinessAccess(
    userId: string,
    businessId: string,
    minRole?: BusinessRole,
  ): Promise<boolean> {
    const role = await this.getUserBusinessRole(userId, businessId);
    if (!role) return false;
    if (!minRole) return true;
    return role === minRole;
  }

  async getUserLocationPermissions(
    userId: string,
    locationId: string,
  ): Promise<LocationMembership | null> {
    return this.prisma.locationMembership.findUnique({
      where: {
        locationId_userId: { locationId, userId },
      },
    });
  }

  async checkLocationPermission(
    userId: string,
    locationId: string,
    permission: keyof LocationMembership,
  ): Promise<boolean> {
    const lm = await this.getUserLocationPermissions(userId, locationId);
    if (!lm) return false;
    return !!lm[permission];
  }

  async assertCanApproveStocktake(
    userId: string,
    businessId: string,
  ): Promise<void> {
    const role = await this.requireRole(userId, businessId);
    if (!canApproveStocktake(role)) {
      throw new ForbiddenException(
        "This action requires owner, admin, business manager, or store manager",
      );
    }
  }

  async assertLocationPermission(
    userId: string,
    businessId: string,
    locationId: string,
    permission: LocationPermission,
  ): Promise<void> {
    const role = await this.requireRole(userId, businessId);
    if (canBypassLocationPermissions(role)) return;
    const allowed = await this.checkLocationPermission(
      userId,
      locationId,
      permission,
    );
    if (!allowed) {
      throw new ForbiddenException(
        "You do not have permission for this location",
      );
    }
  }

  private async requireRole(
    userId: string,
    businessId: string,
  ): Promise<BusinessRole> {
    const role = await this.getUserBusinessRole(userId, businessId);
    if (!role) {
      throw new ForbiddenException("You do not have access to this business");
    }
    return role;
  }
}
