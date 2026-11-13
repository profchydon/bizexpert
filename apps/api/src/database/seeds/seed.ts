import { resolve } from "path";
import { config as loadEnv } from "dotenv";
import * as bcrypt from "bcrypt";
import { BusinessRole, PrismaClient } from "@prisma/client";
import { createDemoSale } from "./seed-demo-sale";
import {
  createDemoCatalog,
  createDemoLocations,
  setOpening,
} from "./seed-demo";
import { businessSlug } from "./seed-math";

loadEnv({ path: resolve(__dirname, "../../../.env.local") });
loadEnv({ path: resolve(__dirname, "../../../.env") });

const DEMO_EMAIL = "owner@demo.bizexpert.ng";
const DEMO_PASSWORD = "Demo1234!";
const BCRYPT_ROUNDS = 12;

async function main() {
  const prisma = new PrismaClient();
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });
  if (existing) {
    console.log("Seed already applied (demo user exists). Skipping.");
    await prisma.$disconnect();
    return;
  }

  const owner = await prisma.user.create({
    data: {
      name: "Demo Owner",
      email: DEMO_EMAIL,
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS),
      phone: "+2348012345678",
    },
  });
  const business = await prisma.business.create({
    data: {
      name: "Demo Wholesalers Ltd",
      slug: businessSlug("Demo Wholesalers Ltd"),
      description: "Pilot demo business",
      phone: "+2348012345678",
    },
  });
  await prisma.businessMembership.create({
    data: {
      businessId: business.id,
      userId: owner.id,
      role: BusinessRole.owner,
    },
  });

  const { warehouse, shop } = await createDemoLocations(prisma, business.id);
  const { noodles, drinks } = await createDemoCatalog(prisma, business.id);

  await setOpening(prisma, {
    businessId: business.id,
    locationId: warehouse.id,
    productId: noodles.id,
    userId: owner.id,
    quantity: 2000,
    unitCost: 2000,
  });
  await setOpening(prisma, {
    businessId: business.id,
    locationId: warehouse.id,
    productId: drinks.id,
    userId: owner.id,
    quantity: 4800,
    unitCost: 350,
  });
  await setOpening(prisma, {
    businessId: business.id,
    locationId: shop.id,
    productId: drinks.id,
    userId: owner.id,
    quantity: 240,
    unitCost: 350,
  });
  await createDemoSale(prisma, {
    businessId: business.id,
    shopId: shop.id,
    drinksId: drinks.id,
    userId: owner.id,
  });

  console.log("Seed complete.");
  console.log(`  Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
