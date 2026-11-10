CREATE TYPE "BusinessRole_new" AS ENUM (
  'owner',
  'admin',
  'business_manager',
  'store_keeper',
  'developer',
  'customer_support',
  'waybill_manager',
  'sales_cashier',
  'cashier',
  'store_manager',
  'accountant'
);

ALTER TABLE "business_memberships"
  ALTER COLUMN "role" TYPE "BusinessRole_new"
  USING (
    CASE "role"::text
      WHEN 'manager' THEN 'admin'
      WHEN 'attendant' THEN 'cashier'
      ELSE "role"::text
    END
  )::"BusinessRole_new";

DROP TYPE "BusinessRole";

ALTER TYPE "BusinessRole_new" RENAME TO "BusinessRole";
