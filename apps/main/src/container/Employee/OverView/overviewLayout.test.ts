import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  employeeOverviewCatalogCopy,
  employeeOverviewSectionOrder,
} from "./overviewLayout";

describe("employee overview layout", () => {
  it("places catalog policies above assets", () => {
    assert.deepEqual(employeeOverviewSectionOrder, [
      "approvals",
      "catalog-policies",
      "assets",
    ]);
  });

  it("labels the employee catalog section as Catalog", () => {
    assert.equal(employeeOverviewCatalogCopy.title, "Catalog");
    assert.equal(
      employeeOverviewCatalogCopy.emptyTitle,
      "No catalog assigned yet",
    );
  });
});
