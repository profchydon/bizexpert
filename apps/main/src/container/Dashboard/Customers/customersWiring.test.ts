import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("customers page is wired to the Remote customers container", () => {
  const page = readFileSync("src/app/dashboard/customers/page.tsx", "utf8");
  const detail = readFileSync(
    "src/app/dashboard/customers/[id]/page.tsx",
    "utf8",
  );
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Customers"), true);
  assert.equal(detail.includes("CustomerDetail"), true);
});

test("customer mutations use the customers API", () => {
  const form = readFileSync(
    "src/container/Dashboard/Customers/CustomerFormSlideout.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/Customers/CustomersTable.tsx",
    "utf8",
  );
  const ledger = readFileSync(
    "src/container/Dashboard/Customers/CustomerDetail/CustomerLedgerSlideout.tsx",
    "utf8",
  );
  assert.equal(form.includes("bizexpertApi.post"), true);
  assert.equal(form.includes("bizexpertApi.put"), true);
  assert.equal(table.includes("bizexpertApi.delete"), true);
  assert.equal(ledger.includes("/ledger"), true);
});

test("row actions include view edit and delete", () => {
  const actions = readFileSync(
    "src/container/Dashboard/Customers/tableActions.tsx",
    "utf8",
  );
  assert.equal(actions.includes("View"), true);
  assert.equal(actions.includes("Edit"), true);
  assert.equal(actions.includes("Delete"), true);
});
