import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("products page is wired to the Remote products container", () => {
  const page = readFileSync("src/app/dashboard/products/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Products"), true);
});

test("product mutations use the products API", () => {
  const form = readFileSync(
    "src/container/Dashboard/Products/ProductFormSlideout.tsx",
    "utf8",
  );
  const create = readFileSync(
    "src/container/Dashboard/Products/SingleProductCreateSlideout.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/Products/ProductsTable.tsx",
    "utf8",
  );
  const mutations = readFileSync(
    "src/container/Dashboard/Products/useProductsTableMutations.ts",
    "utf8",
  );
  const bulk = readFileSync(
    "src/container/Dashboard/Products/ProductBulkImportSlideout.tsx",
    "utf8",
  );
  assert.equal(form.includes("bizexpertApi.put"), true);
  assert.equal(create.includes("/products/full"), true);
  assert.equal(mutations.includes("bulk-deactivate"), true);
  assert.equal(table.includes("useProductsTableMutations"), true);
  assert.equal(table.includes("limit: 100"), true);
  assert.equal(bulk.includes("bulk-import"), true);
});

test("row actions include edit units and deactivate", () => {
  const actions = readFileSync(
    "src/container/Dashboard/Products/tableActions.tsx",
    "utf8",
  );
  assert.equal(actions.includes("Edit"), true);
  assert.equal(actions.includes("Manage units"), true);
  assert.equal(actions.includes("Deactivate"), true);
});
