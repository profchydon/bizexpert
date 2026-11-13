import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "WizardSelectField.tsx"), "utf8");

describe("WizardSelectField", () => {
  it("renders reference-style items with supporting text and a trailing brand check", () => {
    assert.match(source, /supportingText\?: string/);
    assert.match(source, /whitespace-nowrap text-gray-500/);
    assert.match(source, /ItemIndicator className="ml-auto"/);
    assert.match(source, /text-primary-600/);
    assert.doesNotMatch(source, /pl-9/);
  });

  it("badges an option marked as the current one with its own check", () => {
    assert.match(source, /currentLabel\?: string/);
    assert.match(source, /\{option\.currentLabel && \(/);
    assert.match(source, /<Check className="size-3\.5 shrink-0" \/>/);
    assert.match(source, /bg-primary-50 px-2 py-0\.5 text-xs font-medium/);
  });

  it("keeps the selection indicator separate from the current badge", () => {
    assert.match(source, /ItemIndicator className="ml-auto"/);
    assert.match(source, /<Check className="size-5 shrink-0 text-primary-600"/);
  });

  it("shows an open-state brand border on the trigger", () => {
    assert.match(source, /data-\[state=open\]:border-primary-600/);
  });

  it("matches trigger width in the dropdown viewport", () => {
    assert.match(source, /min-w-\[var\(--radix-select-trigger-width\)\]/);
  });

  it("does not pass a modal prop the Select root does not accept", () => {
    assert.doesNotMatch(source, /modal=/);
  });
});
