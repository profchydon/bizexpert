import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { deviceIconChipClass, deviceIconGlyphClass } from "./deviceIconClasses";

describe("deviceIconClasses", () => {
  it("matches the reference gray-100 chip with a subtle hairline", () => {
    assert.match(deviceIconChipClass, /rounded-full/);
    assert.match(deviceIconChipClass, /bg-gray-100/);
    assert.match(deviceIconChipClass, /ring-1/);
    assert.match(deviceIconChipClass, /ring-inset/);
    assert.match(deviceIconChipClass, /ring-gray-900\/10/);
    assert.doesNotMatch(deviceIconChipClass, /border-gray-200/);
    assert.doesNotMatch(deviceIconChipClass, /bg-gray-50\b/);
  });

  it("uses the lighter quaternary glyph color from the reference", () => {
    assert.match(deviceIconGlyphClass, /text-gray-400/);
    assert.doesNotMatch(deviceIconGlyphClass, /text-gray-500/);
    assert.doesNotMatch(deviceIconGlyphClass, /text-gray-600/);
  });
});
