import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("AllEquipment page actions", () => {
  it("uses base secondary buttons with Plus and Download icons for add/export", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/AllEquipment.tsx",
      ),
      "utf8",
    );

    assert.match(source, /@\/components\/base\/buttons\/button/);
    assert.match(source, /iconLeading=\{Plus\}/);
    assert.match(source, /iconLeading=\{Download01\}/);
    assert.match(source, /color="secondary"/);
    assert.match(source, /import routes from "@\/routes"/);
    assert.match(source, /appendEntityWorkspaceParam/);
    assert.match(
      source,
      /FLEET_INSIGHTS_BUTTON_ENABLED && fleetAccess\.ready && fleetAccess\.on/,
    );
    assert.match(source, /routes\.FLEET_INSIGHTS/);
    assert.match(source, /Add equipment/);
    assert.match(source, /Export data/);
    assert.match(source, /DisabledWithTooltip/);
    assert.match(source, /\{actionsCount\} See actions/);
    assert.match(source, /isDisabled=\{actionsCount < 1\}/);
    assert.doesNotMatch(source, /@\/components\/ui\/button/);
    assert.doesNotMatch(source, /border-primary-300 text-primary-700/);
    assert.doesNotMatch(
      source,
      /<span[\s\S]*onClick=\{toggleImportEquipments\}/,
    );
  });
});
