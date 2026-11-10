/**
 * Demo seed via Nest application context.
 *
 * Usage: npm run db:seed --workspace=apps/api
 */
import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../app.module';
import { AuthService } from '../../auth/auth.service';
import { BusinessesService } from '../../businesses/businesses.service';
import { LocationsService } from '../../locations/locations.service';
import { ProductsService } from '../../products/products.service';
import { InventoryService } from '../../inventory/inventory.service';
import { SalesService } from '../../sales/sales.service';
import { LocationType, PaymentMethod, SaleSource } from '../../common/enums';

const DEMO_EMAIL = 'owner@demo.bizexpert.ng';
const DEMO_PASSWORD = 'Demo1234!';

async function main() {
  const prisma = new PrismaClient();
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log('Seed already applied (demo user exists). Skipping.');
    await prisma.$disconnect();
    return;
  }
  await prisma.$disconnect();

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const authService = app.get(AuthService);
  const businessesService = app.get(BusinessesService);
  const locationsService = app.get(LocationsService);
  const productsService = app.get(ProductsService);
  const inventoryService = app.get(InventoryService);
  const salesService = app.get(SalesService);

  const { user: owner } = await authService.register({
    name: 'Demo Owner',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    phone: '+2348012345678',
  });

  const business = await businessesService.create(owner.id, {
    name: 'Demo Wholesalers Ltd',
    description: 'Pilot demo business',
    phone: '+2348012345678',
  });

  const warehouse = await locationsService.create(business.id, owner.id, {
    name: 'Lagos Warehouse',
    type: LocationType.WAREHOUSE,
    isDefault: true,
  });
  const shop = await locationsService.create(business.id, owner.id, {
    name: 'Ikeja Shop',
    type: LocationType.SHOP,
  });

  const noodles = await productsService.create(business.id, {
    name: 'Instant Noodles',
    sku: 'NDL-001',
    category: 'Groceries',
    sellingPrice: 2500,
    purchaseCost: 2000,
    baseUnit: 'piece',
    lowStockThreshold: 50,
  });
  await productsService.addUnit(noodles.id, business.id, {
    unitName: 'carton',
    conversionFactor: 20,
    sellingPrice: 48000,
  });

  const drinks = await productsService.create(business.id, {
    name: 'Soft Drinks',
    sku: 'DRK-001',
    category: 'Beverages',
    sellingPrice: 500,
    purchaseCost: 350,
    baseUnit: 'piece',
    lowStockThreshold: 100,
  });
  await productsService.addUnit(drinks.id, business.id, {
    unitName: 'carton',
    conversionFactor: 24,
    sellingPrice: 11500,
  });

  await inventoryService.setOpeningStock(business.id, warehouse.id, owner.id, {
    productId: noodles.id,
    quantity: 2000,
    unitCost: 2000,
  });
  await inventoryService.setOpeningStock(business.id, warehouse.id, owner.id, {
    productId: drinks.id,
    quantity: 4800,
    unitCost: 350,
  });
  await inventoryService.setOpeningStock(business.id, shop.id, owner.id, {
    productId: drinks.id,
    quantity: 240,
    unitCost: 350,
  });

  await salesService.createSale(
    business.id,
    owner.id,
    {
      locationId: shop.id,
      items: [{ productId: drinks.id, unitName: 'carton', quantity: 3, unitPrice: 11500 }],
      paymentMethod: PaymentMethod.CASH,
    },
    SaleSource.WEB,
  );

  console.log('Seed complete.');
  console.log(`  Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
