import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { normalizeCustomerName } from './customer-name.util';

export async function assertBusinessAccess(
  prisma: PrismaService,
  userId: string,
  businessId: string,
) {
  const membership = await prisma.businessMembership.findFirst({
    where: { userId, businessId, isActive: true },
  });
  if (!membership) throw new ForbiddenException('No access to this business');
}

export function parseCustomerName(raw: string): string {
  const name = normalizeCustomerName(raw);
  if (!name) throw new BadRequestException('Customer name is required');
  return name;
}

export async function requireActiveCustomer(
  prisma: PrismaService,
  id: string,
  businessId: string,
) {
  const row = await prisma.customer.findFirst({
    where: { id, businessId, isActive: true },
  });
  if (!row) throw new NotFoundException('Customer not found');
  return row;
}
