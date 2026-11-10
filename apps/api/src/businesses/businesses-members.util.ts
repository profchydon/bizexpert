import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { BusinessMembership } from "@prisma/client";
import { BusinessRole } from "../common/enums";
import {
  canManageMembers,
  isAssignableBusinessRole,
  isProtectedOwnerRole,
} from "../common/role-access";
import { PrismaService } from "../prisma/prisma.service";
import { AddMemberDto } from "./dto/add-member.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";

export async function requireMembership(
  prisma: PrismaService,
  userId: string,
  businessId: string,
): Promise<BusinessMembership> {
  const membership = await prisma.businessMembership.findFirst({
    where: { userId, businessId, isActive: true },
  });
  if (!membership) {
    throw new ForbiddenException("You do not have access to this business");
  }
  return membership;
}

export async function requireManageMembers(
  prisma: PrismaService,
  userId: string,
  businessId: string,
): Promise<void> {
  const membership = await requireMembership(prisma, userId, businessId);
  if (!canManageMembers(membership.role as BusinessRole)) {
    throw new ForbiddenException(
      "This action requires the owner or admin role",
    );
  }
}

export function requireAssignableRole(role: BusinessRole): void {
  if (!isAssignableBusinessRole(role)) {
    throw new ForbiddenException("Cannot assign the owner role");
  }
}

export async function listBusinessMembers(
  prisma: PrismaService,
  businessId: string,
): Promise<BusinessMembership[]> {
  return prisma.businessMembership.findMany({
    where: { businessId, isActive: true },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function addBusinessMember(
  prisma: PrismaService,
  businessId: string,
  dto: AddMemberDto,
): Promise<BusinessMembership> {
  requireAssignableRole(dto.role);
  const targetUser = await prisma.user.findUnique({
    where: { email: dto.email.toLowerCase().trim() },
  });
  if (!targetUser) {
    throw new NotFoundException(`No user found with email: ${dto.email}`);
  }

  const existing = await prisma.businessMembership.findUnique({
    where: {
      businessId_userId: { businessId, userId: targetUser.id },
    },
  });
  if (existing) {
    if (existing.isActive) {
      throw new ConflictException("User is already a member of this business");
    }
    return prisma.businessMembership.update({
      where: { id: existing.id },
      data: { isActive: true, role: dto.role },
    });
  }

  return prisma.businessMembership.create({
    data: {
      businessId,
      userId: targetUser.id,
      role: dto.role,
    },
  });
}

export async function updateBusinessMemberRole(
  prisma: PrismaService,
  businessId: string,
  memberId: string,
  dto: UpdateMemberRoleDto,
): Promise<BusinessMembership> {
  requireAssignableRole(dto.role);
  const membership = await prisma.businessMembership.findFirst({
    where: { id: memberId, businessId },
  });
  if (!membership) {
    throw new NotFoundException("Membership not found");
  }
  if (isProtectedOwnerRole(membership.role as BusinessRole)) {
    throw new ForbiddenException(
      "Cannot change the role of the business owner",
    );
  }
  return prisma.businessMembership.update({
    where: { id: memberId },
    data: { role: dto.role },
  });
}

export async function removeBusinessMember(
  prisma: PrismaService,
  businessId: string,
  memberId: string,
): Promise<void> {
  const membership = await prisma.businessMembership.findFirst({
    where: { id: memberId, businessId },
  });
  if (!membership) {
    throw new NotFoundException("Membership not found");
  }
  if (isProtectedOwnerRole(membership.role as BusinessRole)) {
    throw new ForbiddenException("Cannot remove the business owner");
  }
  await prisma.businessMembership.update({
    where: { id: memberId },
    data: { isActive: false },
  });
}
