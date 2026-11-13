import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const readMenu = () =>
  readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Orders/ViewOrder/v2/table/OrderInfoRowMenu.tsx",
    ),
    "utf8",
  );

describe("OrderInfoRowMenu", () => {
  it("uses the reference Dropdown dots menu pattern", () => {
    const menu = readMenu();

    assert.match(menu, /Dropdown\.DotsButton/);
    assert.match(menu, /Dropdown\.Popover/);
    assert.match(menu, /selectionMode="none"/);
    assert.doesNotMatch(menu, /DropdownMenu/);
    assert.doesNotMatch(menu, /MoreVertical/);
  });

  it("matches design-ui menu items and hides set window", () => {
    const menu = readMenu();

    assert.match(menu, /label="View"/);
    assert.match(menu, /ShieldTick/);
    assert.match(menu, /label="Cancel sub-order"/);
    assert.match(menu, /SlashCircle01/);
    assert.doesNotMatch(menu, /Set \/ change window/i);
    assert.doesNotMatch(menu, /Request cancel/);
  });
});
