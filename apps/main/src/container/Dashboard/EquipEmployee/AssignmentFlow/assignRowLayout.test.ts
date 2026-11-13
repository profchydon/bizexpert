import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ASSIGN_COLUMNS, ASSIGN_ROW_COLS } from "./assignRowLayout.ts";

const dir = "src/container/Dashboard/EquipEmployee/AssignmentFlow";
const read = (file: string) =>
  readFileSync(join(process.cwd(), dir, file), "utf8");

describe("assignRowLayout", () => {
  it("labels columns in the design-ui order", () => {
    assert.deepEqual(
      ASSIGN_COLUMNS.filter((label) => label.length > 0),
      ["Device", "Going to", "Setup", "Preferred delivery date", "Price"],
    );
  });

  it("has one track per column, ending with the remove button", () => {
    assert.equal(ASSIGN_ROW_COLS.split(/ (?![^(]*\))/).length, 7);
    assert.equal(ASSIGN_COLUMNS.length, 7);
    assert.match(ASSIGN_ROW_COLS, / 32px$/);
  });
});

describe("assign country card", () => {
  it("renders each country as a card with progress, invite, and subtotal", () => {
    const section = read("CountryAssignmentSection.tsx");

    assert.match(section, /rounded-2xl border border-secondary bg-primary/);
    assert.match(section, /<AssignmentGroupHeader/);
    assert.match(section, /isUntouched && \(\s*<AssignmentGroupInvite/);
    assert.match(section, /formatAmount\(countrySummary\.subtotal\)/);
    assert.doesNotMatch(section, /CartCountryHeader/);
  });

  it("shows the progress count and invite copy from design-ui", () => {
    assert.match(
      read("AssignmentGroupHeader.tsx"),
      /\{done\} of \{summary\.total\}/,
    );
    assert.match(
      read("AssignmentGroupInvite.tsx"),
      /Most orders go to one place\./,
    );
  });

  it("gives each row a rail, an arrival line, and a remove button", () => {
    const row = read("DeviceRow.tsx");

    assert.match(row, /destinationRail\(unit\.destination\)/);
    assert.match(row, /Arrives in/);
    assert.match(row, /Remove \$\{deviceName\} from this order/);
    assert.match(row, /<InactiveCell/);
  });

  it("keeps Going to on the same line as Setup and the date, with its detail below", () => {
    const row = read("DeviceRow.tsx");
    const destinationCell = row.slice(
      row.indexOf('<div className="min-w-0">'),
      row.indexOf("{setupOptions.length > 0"),
    );

    assert.match(destinationCell, /<DestinationPicker/);
    assert.doesNotMatch(destinationCell, /<DestinationMeta/);
    assert.match(
      row,
      /col-start-3 -mt-1\.5 min-w-0 empty:hidden">\s*<DestinationMeta/,
    );
  });

  it("removes a unit and updates the cart quantity", () => {
    const page = read("index.tsx");

    assert.match(page, /type: "REMOVE_UNIT"/);
    assert.match(page, /updateQty\(pricingId, remaining\)/);
    assert.match(page, /removeItemFromCart\(pricingId\)/);
    assert.match(page, /<AssignmentEmptyState/);
  });
});
