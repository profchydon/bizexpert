import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("DisposeBuybackStep", () => {
  it("disables buyback quote with a Coming soon tooltip", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/dispose/DisposeBuybackStep.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Request a buyback quote/);
    assert.match(source, /DisabledWithTooltip/);
    assert.match(source, /reason="Coming soon"/);
    assert.match(source, /isDisabled/);
    assert.doesNotMatch(source, /onClick=\{onRequestQuote\}/);
  });
});
