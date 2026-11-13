import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("payments page is wired to the Payments container", () => {
  const page = readFileSync("src/app/dashboard/payments/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Payments"), true);
});

test("payments list and create use verified payment endpoints", () => {
  const table = readFileSync(
    "src/container/Dashboard/Payments/PaymentsTable.tsx",
    "utf8",
  );
  const form = readFileSync(
    "src/container/Dashboard/Payments/PaymentFormSlideout.tsx",
    "utf8",
  );
  assert.equal(table.includes("/payments"), true);
  assert.equal(form.includes("/sales/${values.saleId}/payments"), true);
  assert.equal(form.includes("toCreatePaymentPayload"), true);
  assert.equal(form.includes('status: "completed"'), true);
});

test("transactions page lists inflow payments with date store and method filters", () => {
  const page = readFileSync(
    "src/app/dashboard/payments/transactions/page.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/Payments/PaymentTransactionsTable.tsx",
    "utf8",
  );
  const nav = readFileSync(
    "src/container/Dashboard/Payments/PaymentsAnalyticsNav.tsx",
    "utf8",
  );
  assert.equal(page.includes("PaymentTransactions"), true);
  assert.equal(table.includes("/payments"), true);
  assert.equal(table.includes("paymentTransactionParams"), true);
  assert.equal(nav.includes("PAYMENTS_TRANSACTIONS"), true);
});

test("cashflow and customer analytics pages call analytics endpoints", () => {
  const cashflowPage = readFileSync(
    "src/app/dashboard/payments/cashflow/page.tsx",
    "utf8",
  );
  const customersPage = readFileSync(
    "src/app/dashboard/payments/customers/page.tsx",
    "utf8",
  );
  const cashflow = readFileSync(
    "src/container/Dashboard/Payments/CashflowAnalytics.tsx",
    "utf8",
  );
  const customers = readFileSync(
    "src/container/Dashboard/Payments/CustomerAnalytics.tsx",
    "utf8",
  );
  assert.equal(cashflowPage.includes("CashflowAnalytics"), true);
  assert.equal(customersPage.includes("CustomerAnalytics"), true);
  assert.equal(cashflow.includes("/analytics/cashflow"), true);
  assert.equal(customers.includes("/analytics/customers"), true);
});
