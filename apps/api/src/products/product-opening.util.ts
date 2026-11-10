import { StockMovementType } from '../common/enums';
import { add, multiply, round2, weightedAverageCost } from '../common/utils/decimal.util';
import type { PrismaService } from '../prisma/prisma.service';

type Tx = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

export async function applyOpeningStock(
  tx: Tx,
  params: {
    businessId: string;
    locationId: string;
    productId: string;
    userId: string;
    quantity: number;
    unitCost: number;
  },
): Promise<void> {
  if (params.quantity <= 0) return;
  let balance = await tx.inventoryBalance.findFirst({
    where: { productId: params.productId, locationId: params.locationId },
  });
  if (!balance) {
    balance = await tx.inventoryBalance.create({
      data: {
        productId: params.productId,
        locationId: params.locationId,
        quantity: 0,
        averageCost: 0,
        totalValue: 0,
      },
    });
  }
  const newAvgCost = weightedAverageCost(
    Number(balance.quantity),
    Number(balance.averageCost),
    params.quantity,
    params.unitCost,
  );
  const newQty = round2(add(Number(balance.quantity), params.quantity));
  await tx.inventoryBalance.update({
    where: { id: balance.id },
    data: {
      quantity: newQty,
      averageCost: newAvgCost,
      totalValue: round2(multiply(newQty, newAvgCost)),
    },
  });
  await tx.stockMovement.create({
    data: {
      businessId: params.businessId,
      locationId: params.locationId,
      productId: params.productId,
      type: StockMovementType.OPENING,
      quantity: params.quantity,
      unitCost: params.unitCost,
      totalCost: round2(multiply(params.quantity, params.unitCost)),
      referenceType: 'opening',
      referenceId: null,
      reason: 'Opening stock',
      userId: params.userId,
    },
  });
}
