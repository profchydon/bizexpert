import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import {
  accountsTableCardClass,
  accountsToolbarIconClass,
  accountsToolbarOutlineButtonClass,
  accountsToolbarPrimaryButtonClass,
  accountsToolbarSearchClass,
} from "./accountsTableToolbarClasses";

describe("accounts table toolbar classes", () => {
  it("matches design-ui sm control sizing with py-2 and rounded-lg", () => {
    assert.match(accountsToolbarSearchClass, /h-auto/);
    assert.match(accountsToolbarSearchClass, /py-2/);
    assert.match(accountsToolbarSearchClass, /rounded-lg/);
    assert.match(accountsToolbarSearchClass, /pl-10/);
    assert.match(accountsToolbarOutlineButtonClass, /py-2/);
    assert.match(accountsToolbarOutlineButtonClass, /rounded-lg/);
    assert.match(accountsToolbarPrimaryButtonClass, /py-2/);
    assert.match(accountsToolbarPrimaryButtonClass, /rounded-lg/);
    assert.match(accountsToolbarPrimaryButtonClass, /\bbg-primary-600\b/);
    assert.match(accountsToolbarPrimaryButtonClass, /hover:bg-primary-700/);
    assert.match(accountsToolbarIconClass, /size-5/);
    assert.match(accountsToolbarSearchClass, /focus-visible:ring-0/);
    assert.match(accountsToolbarOutlineButtonClass, /focus-visible:ring-0/);
    assert.match(accountsToolbarPrimaryButtonClass, /focus-visible:ring-0/);
  });

  it("matches design-ui TableCard shell with a single gray border and no shadow-xs", () => {
    assert.match(accountsTableCardClass, /overflow-visible/);
    assert.match(accountsTableCardClass, /rounded-xl/);
    assert.match(accountsTableCardClass, /border border-gray-200/);
    assert.doesNotMatch(accountsTableCardClass, /ring-/);
    assert.doesNotMatch(accountsTableCardClass, /shadow-xs/);
  });
});

describe("AccountsTableHeader toolbar", () => {
  it("keeps search, filter, and action controls on one aligned row", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/AccountsTableHeader.tsx",
      ),
      "utf8",
    );

    assert.match(source, /flex-row flex-nowrap items-center justify-end gap-3/);
    assert.match(source, /accountsToolbarSearchClass/);
    assert.match(source, /accountsToolbarIconClass/);
    assert.match(source, /sm:w-80/);
  });
});

describe("SubsidiaryTable shell", () => {
  it("wraps header and table in one TableCard-style shell", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /accountsTableCardClass/);
    assert.doesNotMatch(source, /accountsTableBodyClass/);
  });
});
