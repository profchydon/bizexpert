import { LocationType, PrismaClient, StockMovementType } from "@prisma/client";
import { openingBalance } from "./seed-math";

export async function setOpening(
  prisma: PrismaClient,
  input: {
    businessId: string;
    locationId: string;
    productId: string;
    userId: string;
    quantity: number;
    unitCost: number;
  },
) {
  const figures = openingBalance(input.quantity, input.unitCost);
  await prisma.inventoryBalance.create({
    data: {
      productId: input.productId,
      locationId: input.locationId,
      quantity: figures.quantity,
      averageCost: figures.averageCost,
      totalValue: figures.totalValue,
    },
  });
  await prisma.stockMovement.create({
    data: {
      businessId: input.businessId,
      locationId: input.locationId,
      productId: input.productId,
      type: StockMovementType.opening,
      quantity: input.quantity,
      unitCost: input.unitCost,
      totalCost: figures.totalValue,
      referenceType: "opening",
      reason: "Opening stock",
      userId: input.userId,
    },
  });
}

export async function createDemoLocations(
  prisma: PrismaClient,
  businessId: string,
) {
  await prisma.location.create({
    data: {
      businessId,
      name: "Main Location",
      type: LocationType.shop,
      isDefault: true,
    },
  });
  await prisma.location.updateMany({
    where: { businessId },
    data: { isDefault: false },
  });
  const warehouse = await prisma.location.create({
    data: {
      businessId,
      name: "Lagos Warehouse",
      type: LocationType.warehouse,
      isDefault: true,
    },
  });
  const shop = await prisma.location.create({
    data: {
      businessId,
      name: "Ikeja Shop",
      type: LocationType.shop,
    },
  });
  return { warehouse, shop };
}

export async function createDemoCatalog(
  prisma: PrismaClient,
  businessId: string,
) {
  const noodles = await prisma.product.create({
    data: {
      businessId,
      name: "Instant Noodles",
      sku: "NDL-001",
      category: "Groceries",
      sellingPrice: 2500,
      purchaseCost: 2000,
      baseUnit: "piece",
      lowStockThreshold: 50,
    },
  });
  await prisma.productUnit.create({
    data: {
      productId: noodles.id,
      unitName: "carton",
      conversionFactor: 20,
      sellingPrice: 48000,
    },
  });
  const drinks = await prisma.product.create({
    data: {
      businessId,
      name: "Soft Drinks",
      sku: "DRK-001",
      category: "Beverages",
      sellingPrice: 500,
      purchaseCost: 350,
      baseUnit: "piece",
      lowStockThreshold: 100,
    },
  });
  await prisma.productUnit.create({
    data: {
      productId: drinks.id,
      unitName: "carton",
      conversionFactor: 24,
      sellingPrice: 11500,
    },
  });
  return { noodles, drinks };
}
