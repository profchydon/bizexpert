import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Location, LocationMembership } from '@prisma/client';

import { LocationType } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertBusinessAccess(userId: string, businessId: string) {
    const m = await this.prisma.businessMembership.findFirst({
      where: { userId, businessId, isActive: true },
    });
    if (!m) throw new ForbiddenException('No access to this business');
    return m;
  }

  async create(
    businessId: string,
    userId: string,
    dto: {
      name: string;
      type?: LocationType;
      businessType?: string;
      vatRate?: number;
      address?: string;
      phone?: string;
      isDefault?: boolean;
    },
  ): Promise<Location> {
    await this.assertBusinessAccess(userId, businessId);

    if (dto.isDefault) {
      await this.prisma.location.updateMany({
        where: { businessId },
        data: { isDefault: false },
      });
    }

    return this.prisma.location.create({
      data: {
        businessId,
        name: dto.name,
        type: dto.type ?? LocationType.SHOP,
        businessType: dto.businessType ?? null,
        vatRate: dto.vatRate ?? 0,
        address: dto.address ?? null,
        phone: dto.phone ?? null,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async findAll(businessId: string, userId: string): Promise<Location[]> {
    await this.assertBusinessAccess(userId, businessId);
    return this.prisma.location.findMany({
      where: { businessId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(locationId: string, businessId: string, userId: string): Promise<Location> {
    await this.assertBusinessAccess(userId, businessId);
    const loc = await this.prisma.location.findFirst({
      where: { id: locationId, businessId },
    });
    if (!loc) throw new NotFoundException('Location not found');
    return loc;
  }

  async update(
    locationId: string,
    businessId: string,
    userId: string,
    dto: Partial<{
      name: string;
      type: LocationType;
      businessType: string;
      vatRate: number;
      address: string;
      phone: string;
    }>,
  ): Promise<Location> {
    await this.assertBusinessAccess(userId, businessId);
    const loc = await this.prisma.location.findFirst({
      where: { id: locationId, businessId },
    });
    if (!loc) throw new NotFoundException('Location not found');
    return this.prisma.location.update({
      where: { id: locationId },
      data: dto,
    });
  }

  async deactivate(locationId: string, businessId: string, userId: string): Promise<void> {
    await this.assertBusinessAccess(userId, businessId);
    await this.prisma.location.updateMany({
      where: { id: locationId, businessId },
      data: { isActive: false },
    });
  }

  async setDefault(locationId: string, businessId: string, userId: string): Promise<Location> {
    await this.assertBusinessAccess(userId, businessId);
    await this.prisma.location.updateMany({
      where: { businessId },
      data: { isDefault: false },
    });
    await this.prisma.location.updateMany({
      where: { id: locationId, businessId },
      data: { isDefault: true },
    });
    return this.prisma.location.findFirstOrThrow({ where: { id: locationId } });
  }

  async getStaff(locationId: string): Promise<LocationMembership[]> {
    return this.prisma.locationMembership.findMany({
      where: { locationId },
      include: { user: true },
    });
  }

  async assignStaff(
    locationId: string,
    businessId: string,
    dto: {
      userId: string;
      canSell?: boolean;
      canReceiveStock?: boolean;
      canTransferStock?: boolean;
      canViewAnalytics?: boolean;
    },
  ): Promise<LocationMembership> {
    const loc = await this.prisma.location.findFirst({
      where: { id: locationId, businessId },
    });
    if (!loc) throw new NotFoundException('Location not found');

    const existing = await this.prisma.locationMembership.findUnique({
      where: {
        locationId_userId: { locationId, userId: dto.userId },
      },
    });

    if (existing) {
      return this.prisma.locationMembership.update({
        where: { id: existing.id },
        data: {
          canSell: dto.canSell ?? true,
          canReceiveStock: dto.canReceiveStock ?? false,
          canTransferStock: dto.canTransferStock ?? false,
          canViewAnalytics: dto.canViewAnalytics ?? false,
        },
      });
    }

    return this.prisma.locationMembership.create({
      data: {
        locationId,
        userId: dto.userId,
        canSell: dto.canSell ?? true,
        canReceiveStock: dto.canReceiveStock ?? false,
        canTransferStock: dto.canTransferStock ?? false,
        canViewAnalytics: dto.canViewAnalytics ?? false,
      },
    });
  }

  async updateStaffPermissions(
    locationId: string,
    memberId: string,
    dto: Partial<{
      canSell: boolean;
      canReceiveStock: boolean;
      canTransferStock: boolean;
      canViewAnalytics: boolean;
    }>,
  ): Promise<LocationMembership> {
    const lm = await this.prisma.locationMembership.findFirst({
      where: { id: memberId, locationId },
    });
    if (!lm) throw new NotFoundException('Staff assignment not found');
    return this.prisma.locationMembership.update({
      where: { id: memberId },
      data: dto,
    });
  }

  async removeStaff(locationId: string, memberId: string): Promise<void> {
    await this.prisma.locationMembership.deleteMany({
      where: { id: memberId, locationId },
    });
  }
}
