import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("sales page is wired to the Sales container", () => {
  const page = readFileSync("src/app/dashboard/sales/page.tsx", "utf8");
  const detail = readFileSync("src/app/dashboard/sales/[id]/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Sales"), true);
  assert.equal(detail.includes("SaleDetail"), true);
});

test("sale mutations use the sales API", () => {
  const form = readFileSync(
    "src/container/Dashboard/Sales/SaleFormSlideout.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/Sales/SalesTable.tsx",
    "utf8",
  );
  const detail = readFileSync(
    "src/container/Dashboard/Sales/SaleDetail/index.tsx",
    "utf8",
  );
  const pay = readFileSync(
    "src/container/Dashboard/Sales/AddPaymentSlideout.tsx",
    "utf8",
  );
  const share = readFileSync(
    "src/container/Dashboard/Sales/ShareWhatsappSlideout.tsx",
    "utf8",
  );
  assert.equal(form.includes("bizexpertApi.post"), true);
  assert.equal(form.includes("/sales"), true);
  assert.equal(table.includes("/sales"), true);
  assert.equal(detail.includes("/cancel"), true);
  assert.equal(detail.includes("/refund"), true);
  assert.equal(detail.includes("downloadSaleInvoice"), true);
  assert.equal(pay.includes("/payments"), true);
  assert.equal(share.includes("/share-whatsapp"), true);
});

test("row actions include view", () => {
  const actions = readFileSync(
    "src/container/Dashboard/Sales/tableActions.tsx",
    "utf8",
  );
  assert.equal(actions.includes("View"), true);
});
