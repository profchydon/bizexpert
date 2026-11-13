import { format } from "date-fns";
import {
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  SaleSource,
  SaleStatus,
  StockMovementType,
} from "@prisma/client";
import { cartonSale } from "./seed-math";

export async function createDemoSale(
  prisma: PrismaClient,
  input: {
    businessId: string;
    shopId: string;
    drinksId: string;
    userId: string;
  },
) {
  const sold = cartonSale({
    cartonQty: 3,
    conversionFactor: 24,
    unitPrice: 11500,
    unitCost: 350,
  });
  const remainingQty = 240 - sold.quantityInBase;
  const sale = await prisma.sale.create({
    data: {
      saleNumber: `SAL-${format(new Date(), "yyyyMMdd")}-0001`,
      businessId: input.businessId,
      locationId: input.shopId,
      userId: input.userId,
      source: SaleSource.web,
      status: SaleStatus.completed,
      subtotal: sold.lineTotal,
      totalAmount: sold.lineTotal,
      totalCost: sold.lineCost,
      grossProfit: sold.lineProfit,
      paymentStatus: PaymentStatus.paid,
    },
  });
  await prisma.saleItem.create({
    data: {
      saleId: sale.id,
      productId: input.drinksId,
      productName: "Soft Drinks",
      unitName: "carton",
      quantity: 3,
      unitPrice: 11500,
      lineTotal: sold.lineTotal,
      unitCostSnapshot: 350,
      lineCost: sold.lineCost,
      lineProfit: sold.lineProfit,
    },
  });
  await prisma.inventoryBalance.update({
    where: {
      productId_locationId: {
        productId: input.drinksId,
        locationId: input.shopId,
      },
    },
    data: {
      quantity: remainingQty,
      totalValue: remainingQty * 350,
    },
  });
  await prisma.stockMovement.create({
    data: {
      businessId: input.businessId,
      locationId: input.shopId,
      productId: input.drinksId,
      type: StockMovementType.sale,
      quantity: -sold.quantityInBase,
      unitCost: 350,
      totalCost: sold.lineCost,
      referenceType: "sale",
      referenceId: sale.id,
      userId: input.userId,
    },
  });
  await prisma.payment.create({
    data: {
      saleId: sale.id,
      amount: sold.lineTotal,
      method: PaymentMethod.cash,
      paidAt: new Date(),
    },
  });
}
