import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  maskedDots,
  sensitiveFieldActionsClass,
  sensitiveFieldRowClass,
  sensitiveFieldValueClass,
} from "./sensitiveFieldClasses";

describe("sensitiveFieldClasses", () => {
  it("masks values with bounded dot counts", () => {
    assert.equal(maskedDots("ab"), "••••••");
    assert.equal(maskedDots("a".repeat(30)).length, 18);
  });

  it("uses tertiary mono styling only while masked", () => {
    assert.match(sensitiveFieldValueClass(false), /text-tertiary/);
    assert.doesNotMatch(sensitiveFieldValueClass(false), /text-primary/);
    assert.match(sensitiveFieldValueClass(true), /text-primary/);
    assert.doesNotMatch(sensitiveFieldValueClass(true), /text-tertiary/);
  });

  it("keeps actions beside the value in a single row", () => {
    assert.match(sensitiveFieldRowClass, /justify-between/);
    assert.match(sensitiveFieldRowClass, /w-full/);
    assert.match(sensitiveFieldActionsClass, /shrink-0/);
    assert.match(sensitiveFieldValueClass(true), /min-w-0 flex-1/);
  });
});
