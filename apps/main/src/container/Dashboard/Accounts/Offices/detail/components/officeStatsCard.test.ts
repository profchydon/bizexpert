import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const cardSource = readFileSync(join(dir, "OfficeStatsCard.tsx"), "utf8");

describe("OfficeStatsCard snapshot tiles", () => {
  it("lets each tile shrink inside the three column grid", () => {
    assert.match(cardSource, /grid grid-cols-3/);
    assert.match(cardSource, /flex min-w-0 flex-col/);
  });

  it("clips an overlong value instead of spilling past the tile", () => {
    assert.match(cardSource, /truncate text-left text-lg font-semibold/);
    assert.match(cardSource, /block w-full truncate/);
  });

  it("shows the full amount on hover through the shared tooltip", () => {
    assert.match(cardSource, /<Tooltip title=\{value\}/);
    assert.match(cardSource, /TooltipTrigger/);
    assert.doesNotMatch(cardSource, /title=\{value\}\s*\n?\s*className/);
  });

  it("only offers the tooltip when the value is actually clipped", () => {
    assert.match(cardSource, /isDisabled=\{!isTruncated\}/);
    assert.match(cardSource, /element\.scrollWidth > element\.clientWidth/);
    assert.match(cardSource, /onHoverStart=\{syncTruncation\}/);
    assert.match(cardSource, /onFocus=\{syncTruncation\}/);
  });

  it("keeps digits aligned and restores the full size on wide screens", () => {
    assert.match(cardSource, /tabular-nums/);
    assert.match(cardSource, /xl:text-xl/);
  });

  it("still renders all three snapshot figures", () => {
    assert.match(cardSource, /label="Employees"/);
    assert.match(cardSource, /label="Assets"/);
    assert.match(cardSource, /label="Asset value"/);
    assert.match(cardSource, /formatOfficeMoney\(assetValue, currency\)/);
  });
});
