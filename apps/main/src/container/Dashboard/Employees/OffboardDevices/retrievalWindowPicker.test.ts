import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), "src", file), "utf8");

const picker = read(
  "container/Dashboard/Employees/OffboardDevices/RetrievalWindowPicker.tsx",
);
const windowsHook = read(
  "container/Dashboard/Employees/OffboardDevices/useRetrievalWindows.ts",
);
const restore = read(
  "container/Dashboard/Employees/OffboardDevices/useOffboardReviewRestore.ts",
);

describe("RetrievalWindowPicker", () => {
  it("disables calendar days before the minimum retrieval date", () => {
    assert.match(picker, /disabled=\{\{ before: minDate \}\}/);
    assert.match(picker, /const minDate = minRetrievalDate\(\)/);
  });

  it("does not prefill a stale stored window into the draft range", () => {
    assert.match(picker, /if \(isStoredWindowValid\(value\)\)/);
    assert.match(picker, /setRange\(\{ from: undefined, to: undefined \}\)/);
  });

  it("hides the trigger label when the stored window is stale", () => {
    assert.match(picker, /const storedValid = isStoredWindowValid\(value\)/);
    assert.match(picker, /storedValid\s*\?\s*formatWindowLabel/);
  });
});

describe("retrieval window gating", () => {
  it("treats stale windows as unassigned", () => {
    assert.match(windowsHook, /isStoredWindowValid\(windows\[id\]\)/);
  });

  it("skips restoring a stale window from review state", () => {
    assert.match(restore, /isStoredWindowValid\(reviewedWindow\?\.window\)/);
  });
});
