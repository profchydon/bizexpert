import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { DISPOSITION_OPTIONS } from "./offboardPricing";

const toggle = readFileSync(
  "src/container/Dashboard/Employees/OffboardDevices/DispositionToggle.tsx",
  "utf8",
);

describe("disposition options", () => {
  it("disables Dispose and Reassign until those flows are ready", () => {
    assert.deepEqual(
      DISPOSITION_OPTIONS.map((option) => ({
        value: option.value,
        disabled: option.disabled === true,
      })),
      [
        { value: "STORE", disabled: false },
        { value: "DISPOSE", disabled: true },
        { value: "REASSIGN", disabled: true },
      ],
    );
  });

  it("shows Coming soon on disabled toggle options", () => {
    assert.match(toggle, /disabled=\{option\.disabled\}/);
    assert.match(toggle, /Coming soon/);
  });
});
