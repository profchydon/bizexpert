import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  FLOATING_ALERT_TOP_OFFSET,
  FLOATING_ALERT_Z_INDEX,
} from "./floatingAlertLayout";

describe("floatingAlertLayout", () => {
  it("positions alerts below the fixed dashboard navbar", () => {
    assert.equal(FLOATING_ALERT_TOP_OFFSET, "top-[88px]");
    assert.equal(FLOATING_ALERT_Z_INDEX, "z-[120]");
  });

  it("FloatingAlert uses shared navbar-safe layout classes", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/application/alerts/floating-alert.tsx",
      ),
      "utf8",
    );

    assert.match(source, /FLOATING_ALERT_Z_INDEX/);
    assert.match(source, /FLOATING_ALERT_TOP_OFFSET/);
    assert.doesNotMatch(source, /z-50/);
  });
});
