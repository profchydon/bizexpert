import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { getOffboardEligibility } from "@/container/Dashboard/Employees/EmployeesTable/employeeDevices";

const dir = dirname(fileURLToPath(import.meta.url));
const cardSource = readFileSync(join(dir, "OfficeEmployeesCard.tsx"), "utf8");
const assetsCardSource = readFileSync(
  join(dir, "OfficeAssetsCard.tsx"),
  "utf8",
);
const bulkActionsSource = readFileSync(
  join(dir, "../../hooks/useOfficeBulkActions.ts"),
  "utf8",
);
const membersServerSource = readFileSync(
  join(dir, "../../hooks/useOfficeMembersServer.ts"),
  "utf8",
);

const withDevices = (id: string) => ({ id, equipment_count: 1 });
const withoutDevices = (id: string) => ({ id, equipment_count: 0 });

describe("office employee off-board eligibility", () => {
  it("enables off-board when every selected employee has devices", () => {
    const result = getOffboardEligibility([withDevices("a"), withDevices("b")]);
    assert.equal(result.canOffboard, true);
    assert.equal(result.offboardableRows.length, 2);
    assert.equal(result.excludedCount, 0);
  });

  it("blocks off-board when a selected employee has no devices", () => {
    const result = getOffboardEligibility([
      withDevices("a"),
      withoutDevices("b"),
    ]);
    assert.equal(result.canOffboard, false);
    assert.equal(result.excludedCount, 1);
  });

  it("blocks off-board on an empty selection", () => {
    assert.equal(getOffboardEligibility([]).canOffboard, false);
  });
});

describe("useOfficeBulkActions off-board action", () => {
  it("uses the caller supplied off-board handler when provided", () => {
    assert.match(bulkActionsSource, /onClick: offboard\.onClick/);
    assert.match(bulkActionsSource, /disabled: offboard\.disabled/);
  });

  it("omits the action entirely when no handler is provided", () => {
    assert.match(
      bulkActionsSource,
      /const offboardAction: OfficeBulkAction\[\] = offboard\s*\n?\s*\?/,
    );
    assert.match(bulkActionsSource, /:\s*\[\];/);
    assert.doesNotMatch(bulkActionsSource, /OFFBOARD_UNAVAILABLE_MESSAGE/);
    assert.match(
      bulkActionsSource,
      /OFFBOARD_NO_DEVICES_MESSAGE =\s*\n?\s*"Some selected employees have no assigned devices/,
    );
  });
});

describe("OfficeEmployeesCard off-board wiring", () => {
  it("reuses the employees page off-board flow", () => {
    assert.match(
      cardSource,
      /import { useOffboardConfirm } from "@\/container\/Dashboard\/Employees\/EmployeesTable\/useOffboardConfirm"/,
    );
    assert.match(cardSource, /useOffboardConfirm\(selectedEmployees\)/);
    assert.match(cardSource, /<OffboardConfirmModal/);
    assert.match(cardSource, /onContinue={offboard\.start}/);
  });

  it("resolves the selected rows from the raw employee payload", () => {
    assert.match(membersServerSource, /rawRows,/);
    assert.match(
      cardSource,
      /rawRows\.filter\(\(row\) => sel\.selected\.has\(String\(row\.id \?\? ""\)\)\)/,
    );
  });

  it("disables off-board with the no-devices reason", () => {
    assert.match(cardSource, /disabled: !offboard\.canOffboard/);
    assert.match(cardSource, /OFFBOARD_NO_DEVICES_MESSAGE/);
  });

  it("keeps the assets bulk bar free of any off-board action", () => {
    assert.doesNotMatch(assetsCardSource, /offboard/i);
  });
});
