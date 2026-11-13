import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Orders/ViewOrder/useOrderData.ts",
  ),
  "utf8",
);

describe("useOrderData company id", () => {
  it("returns workspace companyId for signature and cancel actions", () => {
    assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
    assert.match(source, /companyId,/);
    assert.doesNotMatch(source, /getCompanyDetails/);
  });
});
