import { ConflictException, Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  assertBusinessAccess,
  parseCustomerName,
  requireActiveCustomer,
} from './customer-access';
import {
  findPhoneConflict,
  normalizeCustomerPhone,
} from './customer-name.util';
import { saleTotalsForCustomer } from './customer-totals.util';

export type CustomerRecord = Customer & {
  saleCount: number;
  totalSpent: number;
};

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async enrich(row: Customer): Promise<CustomerRecord> {
    const totals = await saleTotalsForCustomer(this.prisma, row.id);
    return { ...row, ...totals };
  }

  async findAll(
    businessId: string,
    userId: string,
    search?: string,
  ): Promise<CustomerRecord[]> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    const needle = search?.trim();
    const rows = await this.prisma.customer.findMany({
      where: {
        businessId,
        isActive: true,
        ...(needle
          ? {
              OR: [
                { name: { contains: needle, mode: 'insensitive' } },
                { phone: { contains: needle, mode: 'insensitive' } },
                { email: { contains: needle, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
    return Promise.all(rows.map((row) => this.enrich(row)));
  }

  async findOne(
    id: string,
    businessId: string,
    userId: string,
  ): Promise<CustomerRecord & { ledger: unknown; sales: unknown }> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    const row = await requireActiveCustomer(this.prisma, id, businessId);
    const [enriched, ledger, sales] = await Promise.all([
      this.enrich(row),
      this.prisma.customerLedger.findMany({
        where: { customerId: id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.sale.findMany({
        where: { customerId: id, businessId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          saleNumber: true,
          totalAmount: true,
          paymentStatus: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);
    return { ...enriched, ledger, sales };
  }

  async create(
    businessId: string,
    userId: string,
    dto: {
      name: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
      creditLimit?: number;
    },
  ): Promise<CustomerRecord> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    const name = parseCustomerName(dto.name);
    const phone = normalizeCustomerPhone(dto.phone);
    const existing = await this.prisma.customer.findMany({
      where: { businessId, isActive: true },
      select: { id: true, phone: true },
    });
    if (findPhoneConflict(existing, phone)) {
      throw new ConflictException('A customer with this phone already exists');
    }
    const row = await this.prisma.customer.create({
      data: {
        businessId,
        name,
        phone,
        email: dto.email?.trim() || null,
        address: dto.address?.trim() || null,
        notes: dto.notes?.trim() || null,
        creditLimit: dto.creditLimit ?? 0,
      },
    });
    return this.enrich(row);
  }
}
