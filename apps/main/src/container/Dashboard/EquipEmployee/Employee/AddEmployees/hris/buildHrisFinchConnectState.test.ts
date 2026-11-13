import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("buildHrisFinchConnectState", () => {
  it("builds a non-live Finch payload for catalog Connect", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/hris/buildHrisFinchConnectState.ts",
      ),
      "utf8",
    );

    assert.match(source, /isLive: false/);
    assert.match(source, /settings_instance: false/);
    assert.match(source, /returnTo: "employees"/);
    assert.match(source, /item\.service !== "finch"/);
  });
});
