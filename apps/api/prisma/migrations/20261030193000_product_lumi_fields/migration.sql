-- CreateEnum
CREATE TYPE "ProductKind" AS ENUM ('product', 'service');

-- AlterTable
ALTER TABLE "products" ADD COLUMN "kind" "ProductKind" NOT NULL DEFAULT 'product';
ALTER TABLE "products" ADD COLUMN "hasVariants" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN "parentProductId" UUID;

-- CreateTable
CREATE TABLE "product_locations" (
    "productId" UUID NOT NULL,
    "locationId" UUID NOT NULL,

    CONSTRAINT "product_locations_pkey" PRIMARY KEY ("productId","locationId")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_locations" ADD CONSTRAINT "product_locations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_locations" ADD CONSTRAINT "product_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
