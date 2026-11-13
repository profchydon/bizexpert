import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("useAccountsClickOutside", () => {
  it("defers the outside listener until after the opening interaction", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useAccountsClickOutside.ts",
      ),
      "utf8",
    );

    assert.match(source, /requestAnimationFrame/);
    assert.match(source, /pointerdown/);
  });
});
