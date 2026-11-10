ALTER TABLE "categories" ADD COLUMN "parent_id" UUID;

ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_businessId_name_key";

ALTER TABLE "categories"
  ADD CONSTRAINT "categories_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "categories_business_main_name_key"
  ON "categories" ("businessId", "name")
  WHERE "parent_id" IS NULL;

CREATE UNIQUE INDEX "categories_parent_sub_name_key"
  ON "categories" ("parent_id", "name")
  WHERE "parent_id" IS NOT NULL;

ALTER TABLE "products" ADD COLUMN "sub_category" VARCHAR(100);
