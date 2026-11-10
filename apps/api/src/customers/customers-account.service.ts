import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CustomerLedgerType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  assertBusinessAccess,
  parseCustomerName,
  requireActiveCustomer,
} from './customer-access';
import {
  ledgerApplyError,
  nextOutstandingBalance,
  nextWalletBalance,
  type LedgerType,
} from './customer-ledger.util';
import {
  findPhoneConflict,
  normalizeCustomerPhone,
} from './customer-name.util';
import { CustomersService, type CustomerRecord } from './customers.service';

@Injectable()
export class CustomersAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
  ) {}

  async update(
    id: string,
    businessId: string,
    userId: string,
    dto: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
      creditLimit?: number;
    },
  ): Promise<CustomerRecord> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    const current = await requireActiveCustomer(this.prisma, id, businessId);
    const phone =
      dto.phone !== undefined
        ? normalizeCustomerPhone(dto.phone)
        : current.phone;
    if (phone !== current.phone) {
      const existing = await this.prisma.customer.findMany({
        where: { businessId, isActive: true },
        select: { id: true, phone: true },
      });
      if (findPhoneConflict(existing, phone, id)) {
        throw new ConflictException('A customer with this phone already exists');
      }
    }
    const row = await this.prisma.customer.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: parseCustomerName(dto.name) }),
        ...(dto.phone !== undefined && { phone }),
        ...(dto.email !== undefined && { email: dto.email.trim() || null }),
        ...(dto.address !== undefined && {
          address: dto.address.trim() || null,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes.trim() || null }),
        ...(dto.creditLimit !== undefined && { creditLimit: dto.creditLimit }),
      },
    });
    return this.customersService.enrich(row);
  }

  async deactivate(
    id: string,
    businessId: string,
    userId: string,
  ): Promise<void> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    await requireActiveCustomer(this.prisma, id, businessId);
    await this.prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async applyLedger(
    id: string,
    businessId: string,
    userId: string,
    dto: { type: CustomerLedgerType; amount: number; note?: string },
  ): Promise<CustomerRecord> {
    await assertBusinessAccess(this.prisma, userId, businessId);
    const current = await requireActiveCustomer(this.prisma, id, businessId);
    const type = dto.type as LedgerType;
    const wallet = Number(current.walletBalance);
    const outstanding = Number(current.outstandingBalance);
    const error = ledgerApplyError({
      wallet,
      outstanding,
      creditLimit: Number(current.creditLimit),
      type,
      amount: dto.amount,
    });
    if (error) throw new BadRequestException(error);
    const row = await this.prisma.$transaction(async (tx) => {
      await tx.customerLedger.create({
        data: {
          customerId: id,
          type: dto.type,
          amount: dto.amount,
          note: dto.note?.trim() || null,
        },
      });
      return tx.customer.update({
        where: { id },
        data: {
          walletBalance: nextWalletBalance(wallet, type, dto.amount),
          outstandingBalance: nextOutstandingBalance(
            outstanding,
            type,
            dto.amount,
          ),
        },
      });
    });
    return this.customersService.enrich(row);
  }
}
