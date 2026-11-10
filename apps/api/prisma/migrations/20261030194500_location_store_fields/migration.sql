ALTER TABLE "locations" ADD COLUMN "business_type" VARCHAR(50);
ALTER TABLE "locations" ADD COLUMN "vat_rate" DECIMAL(5, 2) NOT NULL DEFAULT 0;
