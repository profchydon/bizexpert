import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const css = readFileSync("src/styles/marketplace-price-slider.css", "utf8");
const globals = readFileSync("src/styles/globals.css", "utf8");
const dualSlider = readFileSync("src/components/ui/slider.tsx", "utf8");

describe("marketplace price slider alignment", () => {
  it("insets the painted track by half the native thumb", () => {
    assert.match(css, /padding-inline: 0\.5rem/);
    assert.match(css, /left: -0\.5rem/);
    assert.match(css, /width: calc\(100% \+ 1rem\)/);
  });

  it("centers the thumbs on the painted track", () => {
    assert.match(globals, /marketplace-price-slider\.css/);
    assert.match(css, /top: 50%/);
    assert.match(css, /height: 1rem/);
    assert.match(css, /transform: translateY\(-50%\)/);
    assert.match(css, /::-webkit-slider-thumb \{\s*margin-top: 0;/);
  });

  it("keeps DualRangeSlider thumbs inside the input width", () => {
    assert.match(dualSlider, /items-center px-2/);
  });
});
