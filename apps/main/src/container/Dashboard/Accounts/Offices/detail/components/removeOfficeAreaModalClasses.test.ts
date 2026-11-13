import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { twMerge } from "tailwind-merge";

import {
  removeAreaModalBodyClass,
  removeAreaModalCancelButtonClass,
  removeAreaModalCloseButtonClass,
  removeAreaModalConfirmButtonClass,
  removeAreaModalContentClass,
  removeAreaModalDismissButtonClass,
  removeAreaModalSingleFooterClass,
  removeAreaModalSplitFooterClass,
  removeAreaModalTitleClass,
} from "./removeOfficeAreaModalClasses";

const DIALOG_CONTENT_BASE =
  "fixed left-[50%] top-[50%] rounded-xl z-[1004] grid w-full max-w-lg gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg";

const merged = twMerge(DIALOG_CONTENT_BASE, removeAreaModalContentClass).split(
  " ",
);

describe("removeAreaModalContentClass", () => {
  it("keeps the reference 2xl corners at every breakpoint", () => {
    assert.ok(merged.includes("rounded-2xl"));
    assert.ok(merged.includes("sm:rounded-2xl"));
    assert.ok(!merged.includes("sm:rounded-lg"));
    assert.ok(!merged.includes("rounded-xl"));
  });

  it("drops the dialog default border and grid gap the reference does not have", () => {
    assert.ok(merged.includes("border-0"));
    assert.ok(!merged.includes("border"));
    assert.ok(merged.includes("gap-0"));
    assert.ok(!merged.includes("gap-4"));
    assert.ok(!merged.includes("grid"));
  });

  it("centers content in a column at the reference width and elevation", () => {
    assert.ok(merged.includes("flex"));
    assert.ok(merged.includes("flex-col"));
    assert.ok(merged.includes("items-center"));
    assert.ok(merged.includes("text-center"));
    assert.ok(merged.includes("max-w-md"));
    assert.ok(!merged.includes("max-w-lg"));
    assert.ok(merged.includes("shadow-xl"));
    assert.ok(merged.includes("p-6"));
  });
});

describe("removeAreaModalCloseButtonClass", () => {
  it("matches the reference sm close button box and tone", () => {
    assert.match(removeAreaModalCloseButtonClass, /absolute right-4 top-4/);
    assert.match(removeAreaModalCloseButtonClass, /size-9/);
    assert.match(removeAreaModalCloseButtonClass, /rounded-lg/);
    assert.match(removeAreaModalCloseButtonClass, /\bp-2\b/);
    assert.match(removeAreaModalCloseButtonClass, /text-gray-400/);
    assert.match(removeAreaModalCloseButtonClass, /hover:text-gray-500/);
  });
});

describe("remove area modal typography and footers", () => {
  it("maps the reference text tokens to the local palette", () => {
    assert.equal(
      removeAreaModalTitleClass,
      "mt-4 text-base font-semibold text-gray-900",
    );
    assert.equal(removeAreaModalBodyClass, "mt-1 text-sm text-gray-600");
  });

  it("uses a full-width dismiss and a two-column confirm", () => {
    assert.equal(removeAreaModalSingleFooterClass, "mt-6 w-full");
    assert.equal(
      removeAreaModalSplitFooterClass,
      "mt-6 grid w-full grid-cols-2 gap-3",
    );
  });

  it("keeps every footer button at the reference sm weight and size", () => {
    for (const button of [
      removeAreaModalDismissButtonClass,
      removeAreaModalCancelButtonClass,
      removeAreaModalConfirmButtonClass,
    ]) {
      assert.match(button, /w-full/);
      assert.match(button, /text-sm/);
      assert.match(button, /font-semibold/);
    }
  });

  it("uses the reference solid error red for the destructive confirm", () => {
    assert.match(removeAreaModalConfirmButtonClass, /bg-error-600/);
    assert.match(removeAreaModalConfirmButtonClass, /hover:bg-error-700/);
  });
});
