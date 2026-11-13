import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("DisabledRadioOption", () => {
  it("renders a tooltip trigger row that matches radio layout", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/base/radio-buttons/disabled-radio-option.tsx",
      ),
      "utf8",
    );

    assert.match(source, /RadioButtonBase/);
    assert.match(source, /TooltipTrigger/);
    assert.match(source, /flex w-full items-start/);
    assert.match(source, /cursor-not-allowed/);
  });
});

describe("DisposalMethodChoice", () => {
  it("disables donate with a Coming soon tooltip and defaults to destroy", () => {
    const choice = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/dispose/DisposalMethodChoice.tsx",
      ),
      "utf8",
    );
    const modal = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/dispose/DisposeDeviceModal.tsx",
      ),
      "utf8",
    );
    const bulk = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/BulkActionsModal.tsx",
      ),
      "utf8",
    );

    assert.match(choice, /DisabledRadioOption/);
    assert.match(choice, /tooltip="Coming soon"/);
    assert.match(choice, /value="destroy"/);
    assert.doesNotMatch(choice, /value="donate"/);
    assert.match(choice, /DEFAULT_DISPOSAL_METHOD: DisposalMethod = "destroy"/);
    assert.match(modal, /DEFAULT_DISPOSAL_METHOD/);
    assert.match(bulk, /DEFAULT_DISPOSAL_METHOD/);
  });
});
