import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "StepOfficeDetails.tsx"), "utf8");
const basics = readFileSync(join(dir, "OfficeBasicsFields.tsx"), "utf8");

describe("StepOfficeDetails", () => {
  it("describes parent entities with billing currency and region supporting text", () => {
    assert.match(source, /label: option\.name/);
    assert.match(
      source,
      /supportingText: `Bills in \$\{option\.currency\}\. \$\{option\.region\}\.`/,
    );
  });

  it("flags the active workspace entity in the parent dropdown", () => {
    assert.match(
      source,
      /currentLabel: isWorkspaceOwnEntity\(option\.id, workspaceCompanyId\)\s*\?\s*"Current workspace"\s*:\s*undefined,/,
    );
  });

  it("reuses the payload builder's workspace comparison", () => {
    assert.match(
      source,
      /import \{ isWorkspaceOwnEntity \} from "\.\/buildCreateOfficePayload";/,
    );
  });

  it("shows a map pin icon inside the office address input", () => {
    assert.match(basics, /MapPin/);
    assert.match(basics, /pl-\[42px\]/);
  });

  it("sizes wizard inputs to the reference md fields", () => {
    assert.match(basics, /rounded-lg px-3\.5 text-base/);
  });

  it("delegates the name, type and address fields to OfficeBasicsFields", () => {
    assert.match(source, /<OfficeBasicsFields/);
    assert.match(source, /nameInvalid=\{nameInvalid\}/);
    assert.match(source, /addressInvalid=\{addressInvalid\}/);
  });
});
