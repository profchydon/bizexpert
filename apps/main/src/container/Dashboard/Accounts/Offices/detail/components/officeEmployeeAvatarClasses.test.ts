import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { officeEmployeeAvatarClass } from "./officeEmployeeAvatarClasses";

describe("officeEmployeeAvatarClasses", () => {
  it("matches the bordered initials avatar from the reference", () => {
    assert.match(officeEmployeeAvatarClass, /rounded-full/);
    assert.match(officeEmployeeAvatarClass, /border-gray-200/);
    assert.match(officeEmployeeAvatarClass, /bg-gray-100/);
    assert.match(officeEmployeeAvatarClass, /font-medium/);
    assert.match(officeEmployeeAvatarClass, /text-gray-500/);
    assert.doesNotMatch(officeEmployeeAvatarClass, /font-semibold/);
  });
});
