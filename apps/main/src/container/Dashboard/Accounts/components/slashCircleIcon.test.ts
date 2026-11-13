import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

describe("SlashCircleIcon", () => {
  it("matches the reference SlashCircle01 glyph", () => {
    const source = readFileSync(join(dir, "SlashCircleIcon.tsx"), "utf8");

    assert.match(source, /m4\.93 4\.93 14\.14 14\.14/);
    assert.match(source, /M22 12c0 5\.523-4\.477 10-10 10S2 17\.523 2 12/);
  });
});
