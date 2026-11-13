import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("DisabledWithTooltip", () => {
  it("wraps disabled controls with a tooltip trigger", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/base/tooltip/disabled-with-tooltip.tsx",
      ),
      "utf8",
    );

    assert.match(source, /DisabledWithTooltip/);
    assert.match(source, /Focusable/);
    assert.match(source, /role="button"/);
    assert.match(source, /aria-disabled="true"/);
    assert.match(source, /tabIndex=\{0\}/);
    assert.match(source, /pointer-events-none/);
    assert.doesNotMatch(source, /TooltipTrigger/);
    assert.doesNotMatch(source, /opacity-60/);
    assert.match(source, /!isDisabled \|\| !message/);
  });
});

describe("equipmentDisabledReasons", () => {
  it("returns reasons for common disabled equipment actions", async () => {
    const {
      getBulkActionDisabledReason,
      getSeeActionsDisabledReason,
      getPendingActionConflictReason,
    } = await import("@/components/AllEquipments/equipmentDisabledReasons.ts");

    assert.match(
      getSeeActionsDisabledReason(0) ?? "",
      /no pending offboarding actions/i,
    );
    assert.equal(getSeeActionsDisabledReason(2), null);
    assert.match(
      getBulkActionDisabledReason([{ status: "in_storage" }], "transfer") ?? "",
      /in storage/i,
    );
    assert.equal(
      getBulkActionDisabledReason([{ status: "assigned" }], "transfer"),
      null,
    );
    assert.match(
      getPendingActionConflictReason("Store", "Transfer") ?? "",
      /pending store action/i,
    );
  });
});
