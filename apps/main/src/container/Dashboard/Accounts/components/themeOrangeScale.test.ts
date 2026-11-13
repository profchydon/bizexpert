import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const themeSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../../../../theme.js"),
  "utf8",
);

describe("theme orange scale", () => {
  it("defines orange shades used by status banners", () => {
    assert.match(themeSource, /orange:\s*\{/);
    assert.match(themeSource, /300: "#F7B27A"/);
    assert.match(themeSource, /50: "#FEF6EE"/);
    assert.match(themeSource, /DEFAULT: "#FF784B"/);
  });
});
