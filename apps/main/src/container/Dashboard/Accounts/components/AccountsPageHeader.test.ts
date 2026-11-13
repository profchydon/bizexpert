import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("AccountsPageHeader layout", () => {
  it("renders the title block before the breadcrumb trail", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/AccountsPageHeader.tsx",
      ),
      "utf8",
    );

    const titleIndex = source.indexOf("<h1");
    const breadcrumbIndex = source.indexOf('aria-label="Breadcrumb"');

    assert.ok(titleIndex >= 0);
    assert.ok(breadcrumbIndex >= 0);
    assert.ok(titleIndex < breadcrumbIndex);
  });
});
