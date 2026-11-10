import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerLedgerType, Prisma } from '@prisma/client';

import { ledgerApplyError } from './customer-ledger.util';

type Tx = Prisma.TransactionClient;

export async function applyCustomerSaleCredit(
  tx: Tx,
  args: {
    businessId: string;
    customerId: string;
    saleId: string;
    amount: number;
  },
) {
  const customer = await tx.customer.findFirst({
    where: { id: args.customerId, businessId: args.businessId, isActive: true },
  });
  if (!customer) throw new NotFoundException('Customer not found');

  const outstanding = Number(customer.outstandingBalance);
  const creditLimit = Number(customer.creditLimit);
  const error = ledgerApplyError({
    wallet: Number(customer.walletBalance),
    outstanding,
    creditLimit,
    type: 'debt',
    amount: args.amount,
  });
  if (error) throw new BadRequestException(error);

  await tx.customerLedger.create({
    data: {
      customerId: customer.id,
      type: CustomerLedgerType.debt,
      amount: args.amount,
      note: 'Credit sale',
      saleId: args.saleId,
    },
  });
  return tx.customer.update({
    where: { id: customer.id },
    data: { outstandingBalance: outstanding + args.amount },
  });
}

export async function resolveCustomerName(
  tx: Tx,
  businessId: string,
  customerId?: string,
): Promise<string | null> {
  if (!customerId) return null;
  const customer = await tx.customer.findFirst({
    where: { id: customerId, businessId, isActive: true },
    select: { name: true },
  });
  if (!customer) throw new NotFoundException('Customer not found');
  return customer.name;
}
