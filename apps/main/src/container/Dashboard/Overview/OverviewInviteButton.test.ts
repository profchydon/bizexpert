import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("OverviewInviteButton", () => {
  it("disables + Invite with a Coming soon tooltip", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Overview/OverviewInviteButton.tsx",
      ),
      "utf8",
    );
    const globalHeader = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Overview/OverviewDashboardHeader.tsx",
      ),
      "utf8",
    );
    const scopedHeader = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Overview/OverviewScopedHeader.tsx",
      ),
      "utf8",
    );

    assert.match(source, /DisabledWithTooltip/);
    assert.match(source, /reason="Coming soon"/);
    assert.match(source, /\+ Invite/);
    assert.match(source, /isDisabled/);
    assert.match(source, /<Button/);

    const tooltipSource = readFileSync(
      join(
        process.cwd(),
        "src/components/base/tooltip/disabled-with-tooltip.tsx",
      ),
      "utf8",
    );
    assert.match(tooltipSource, /<span/);
    assert.doesNotMatch(tooltipSource, /TooltipTrigger/);
    assert.match(globalHeader, /OverviewInviteButton/);
    assert.match(scopedHeader, /OverviewInviteButton/);
    assert.doesNotMatch(globalHeader, /onInvite/);
    assert.doesNotMatch(scopedHeader, /onInvite/);
  });
});
