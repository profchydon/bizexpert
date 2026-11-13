import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("ViewActions checkout loading", () => {
  it("scopes checkout loading to the checkout button via activeNav", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/ViewActions/index.tsx"),
      "utf8",
    );

    assert.match(source, /activeNav/);
    assert.match(source, /isLoading=\{isPending && activeNav === "checkout"\}/);
    assert.match(source, /checkoutRoute\?: string/);
    assert.match(source, /if \(checkoutRoute\)/);
  });

  it("passes checkoutRoute from device refresh see actions", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/DeviceRefresh/DeviceRefreshViewAction/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /checkoutRoute=/);
    assert.doesNotMatch(source, /handleCheckout=/);
    assert.doesNotMatch(source, /useTransitionRouter/);
  });
});
