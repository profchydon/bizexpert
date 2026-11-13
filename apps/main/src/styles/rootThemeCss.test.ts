import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const BRIDGES: Array<{ root: string; target: string }> = [
  { root: "theme.css", target: "./src/styles/theme.css" },
  { root: "legacy-bridge.css", target: "./src/styles/legacy-bridge.css" },
  { root: "interactive-cursor.css", target: "./src/styles/interactive-cursor.css" },
  { root: "typography.css", target: "./src/styles/typography.css" },
  {
    root: "marketplace-price-slider.css",
    target: "./src/styles/marketplace-price-slider.css",
  },
  { root: "vendor.css", target: "./src/styles/vendor.css" },
];

for (const { root, target } of BRIDGES) {
  test(`root ${root} re-exports ${target}`, () => {
    const source = readFileSync(root, "utf8");
    assert.match(source, new RegExp(`@import "${target.replace(/\./g, "\\.")}"`));
  });
}
