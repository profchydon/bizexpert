import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("categories page is wired to the Remote categories container", () => {
  const page = readFileSync("src/app/dashboard/categories/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Categories"), true);
});

test("category mutations use the categories API", () => {
  const form = readFileSync(
    "src/container/Dashboard/Categories/CategoryFormSlideout.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/Categories/CategoriesTable.tsx",
    "utf8",
  );
  const actions = readFileSync(
    "src/container/Dashboard/Categories/tableActions.tsx",
    "utf8",
  );
  assert.equal(form.includes("bizexpertApi.post"), true);
  assert.equal(form.includes("bizexpertApi.put"), true);
  assert.equal(table.includes("bizexpertApi.delete"), true);
  assert.equal(actions.includes("Edit"), true);
  assert.equal(actions.includes("Add sub-category"), true);
  assert.equal(actions.includes("Delete"), true);
});

test("product form selects from the categories list", () => {
  const fields = readFileSync(
    "src/container/Dashboard/Products/ProductFormFields.tsx",
    "utf8",
  );
  const slideout = readFileSync(
    "src/container/Dashboard/Products/ProductFormSlideout.tsx",
    "utf8",
  );
  assert.equal(fields.includes("Sub-category"), true);
  assert.equal(slideout.includes("subCategorySelectOptions"), true);
  assert.equal(slideout.includes("/categories"), true);
});
