import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { twMerge } from "tailwind-merge";
import { statusActionModalContentClass } from "./statusActionModalClasses";

const DIALOG_CONTENT_BASE =
  "fixed left-[50%] top-[50%] rounded-xl z-[1004] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg";

describe("statusActionModalContentClass", () => {
  it("keeps fixed centering on DialogContent", () => {
    const merged = twMerge(DIALOG_CONTENT_BASE, statusActionModalContentClass);

    assert.match(merged, /\bfixed\b/);
    assert.doesNotMatch(merged, /\brelative\b/);
    assert.match(merged, /translate-x-\[-50%\]/);
    assert.match(merged, /translate-y-\[-50%\]/);
    assert.match(merged, /z-\[1004\]/);
  });

  it("uses the reference centered column layout", () => {
    const merged = twMerge(DIALOG_CONTENT_BASE, statusActionModalContentClass);

    assert.match(merged, /flex/);
    assert.match(merged, /flex-col/);
    assert.match(merged, /items-center/);
    assert.match(merged, /max-w-md/);
    assert.match(merged, /rounded-2xl/);
    assert.match(merged, /border-0/);
  });
});
