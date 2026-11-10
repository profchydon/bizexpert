import { Injectable, NotFoundException } from "@nestjs/common";
import { Business, BusinessMembership } from "@prisma/client";

import { BusinessRole, LocationType } from "../common/enums";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { PrismaService } from "../prisma/prisma.service";
import {
  addBusinessMember,
  listBusinessMembers,
  removeBusinessMember,
  requireManageMembers,
  requireMembership,
  updateBusinessMemberRole,
} from "./businesses-members.util";

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBusinessDto): Promise<Business> {
    const slug = dto.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const business = await this.prisma.business.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? null,
        phone: dto.phone?.trim() ?? null,
        email: dto.email?.toLowerCase().trim() ?? null,
        address: dto.address?.trim() ?? null,
      },
    });

    await this.prisma.businessMembership.create({
      data: {
        businessId: business.id,
        userId,
        role: BusinessRole.OWNER,
      },
    });

    await this.prisma.location.create({
      data: {
        businessId: business.id,
        name: "Main Location",
        type: LocationType.SHOP,
        isDefault: true,
      },
    });

    return business;
  }

  async findAllByUser(userId: string): Promise<Business[]> {
    const memberships = await this.prisma.businessMembership.findMany({
      where: { userId, isActive: true },
      include: { business: true },
    });
    return memberships.map((m) => m.business).filter(Boolean);
  }

  async findOne(
    businessId: string,
    userId: string,
  ): Promise<Business & { locations: unknown[] }> {
    await requireMembership(this.prisma, userId, businessId);

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { locations: true },
    });
    if (!business) {
      throw new NotFoundException("Business not found");
    }
    return business;
  }

  async update(
    businessId: string,
    userId: string,
    dto: UpdateBusinessDto,
  ): Promise<Business> {
    await requireManageMembers(this.prisma, userId, businessId);

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return this.prisma.business.update({
      where: { id: businessId },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() ?? null,
        }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() ?? null }),
        ...(dto.email !== undefined && {
          email: dto.email?.toLowerCase().trim() ?? null,
        }),
        ...(dto.address !== undefined && {
          address: dto.address?.trim() ?? null,
        }),
      },
    });
  }

  async getMembers(
    businessId: string,
    userId: string,
  ): Promise<BusinessMembership[]> {
    await requireMembership(this.prisma, userId, businessId);
    return listBusinessMembers(this.prisma, businessId);
  }

  async addMember(
    businessId: string,
    userId: string,
    dto: AddMemberDto,
  ): Promise<BusinessMembership> {
    await requireManageMembers(this.prisma, userId, businessId);
    return addBusinessMember(this.prisma, businessId, dto);
  }

  async updateMemberRole(
    businessId: string,
    userId: string,
    memberId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<BusinessMembership> {
    await requireManageMembers(this.prisma, userId, businessId);
    return updateBusinessMemberRole(this.prisma, businessId, memberId, dto);
  }

  async removeMember(
    businessId: string,
    userId: string,
    memberId: string,
  ): Promise<void> {
    await requireManageMembers(this.prisma, userId, businessId);
    await removeBusinessMember(this.prisma, businessId, memberId);
  }
}
