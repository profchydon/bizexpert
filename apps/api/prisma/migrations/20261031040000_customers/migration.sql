-- CreateEnum
CREATE TYPE "CustomerLedgerType" AS ENUM ('wallet_credit', 'wallet_debit', 'debt', 'repayment', 'write_off');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "address" TEXT,
    "notes" TEXT,
    "credit_limit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "wallet_balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "outstanding_balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_ledger" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "type" "CustomerLedgerType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "note" TEXT,
    "saleId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_ledger_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "sales" ADD COLUMN "customerId" UUID;

-- CreateIndex
CREATE INDEX "customers_businessId_idx" ON "customers"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_business_phone_key" ON "customers"("businessId", "phone") WHERE "phone" IS NOT NULL AND "phone" <> '';

-- CreateIndex
CREATE INDEX "customer_ledger_customerId_idx" ON "customer_ledger"("customerId");

-- CreateIndex
CREATE INDEX "sales_customerId_idx" ON "sales"("customerId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_ledger" ADD CONSTRAINT "customer_ledger_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
