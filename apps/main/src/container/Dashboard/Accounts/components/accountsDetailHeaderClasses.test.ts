import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  accountsDetailActionButtonClass,
  accountsDetailPageShellClass,
} from "./accountsDetailHeaderClasses";

describe("accountsDetailHeaderClasses", () => {
  it("adds top padding on detail pages to match the list page", () => {
    assert.match(accountsDetailPageShellClass, /pt-6/);
    assert.match(accountsDetailPageShellClass, /lg:pt-8/);
  });

  it("matches the reference secondary button for header actions", () => {
    assert.match(accountsDetailActionButtonClass, /h-10/);
    assert.match(accountsDetailActionButtonClass, /px-3\.5/);
    assert.match(accountsDetailActionButtonClass, /font-semibold/);
    assert.match(accountsDetailActionButtonClass, /gap-1 /);
    assert.match(accountsDetailActionButtonClass, /ring-inset/);
    assert.match(accountsDetailActionButtonClass, /ring-gray-300/);
    assert.match(accountsDetailActionButtonClass, /text-gray-700/);
    assert.match(accountsDetailActionButtonClass, /shadow-none/);
  });
});

describe("SubsidiaryDetailHeader layout", () => {
  it("renders the divider before the breadcrumb", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailHeader.tsx",
      ),
      "utf8",
    );

    const breadcrumbIndex = source.indexOf("<AccountsDetailBreadcrumb");
    const dividerIndex = source.indexOf(
      "<div className={accountsDetailHeaderDividerClass}",
    );

    assert.ok(breadcrumbIndex >= 0);
    assert.ok(dividerIndex >= 0);
    assert.ok(dividerIndex < breadcrumbIndex);
  });
});

describe("OfficeDetailHeader layout", () => {
  it("includes the parent entity in the breadcrumb trail", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/OfficeDetailHeader.tsx",
      ),
      "utf8",
    );

    assert.match(source, /parent=\{/);
    assert.match(source, /subsidiaryName/);
  });
});
