import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("tsconfig production typecheck", () => {
  it("excludes test files from the Next.js typecheck", () => {
    const source = readFileSync("tsconfig.json", "utf8");
    assert.match(source, /\*\*\/\*\.test\.ts/);
    assert.match(source, /\*\*\/\*\.test\.tsx/);
  });
});
