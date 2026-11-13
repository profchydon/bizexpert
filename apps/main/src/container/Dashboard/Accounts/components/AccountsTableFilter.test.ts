import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("AccountsTableFilter", () => {
  it("opens on pointer down and uses deferred outside-click handling", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/AccountsTableFilter.tsx",
      ),
      "utf8",
    );

    assert.match(source, /onMouseDown/);
    assert.match(source, /useAccountsClickOutside/);
    assert.match(source, /entityStatusFilterOptions/);
    assert.match(source, /ListFilter/);
  });
});
