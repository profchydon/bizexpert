import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cx, sortCx } from "./cx";

describe("cx", () => {
  it("merges conflicting tailwind classes", () => {
    assert.equal(cx("px-2 py-1", "px-4"), "py-1 px-4");
  });

  it("merges display text size tokens", () => {
    assert.equal(cx("text-sm", "text-display-xs"), "text-display-xs");
  });
});

describe("sortCx", () => {
  it("returns the input object unchanged", () => {
    const styles = sortCx({ root: "rounded-lg", active: "bg-primary-600" });
    assert.deepEqual(styles, {
      root: "rounded-lg",
      active: "bg-primary-600",
    });
  });
});
