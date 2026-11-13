import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "OfficeMemberTableHead.tsx"), "utf8");

describe("OfficeMemberTableHead", () => {
  it("keeps each column header on one line", () => {
    assert.match(source, /whitespace-nowrap px-6 py-3/);
    assert.match(
      source,
      /inline-flex items-center gap-1 whitespace-nowrap text-left/,
    );
    assert.match(
      source,
      /text-xs font-semibold whitespace-nowrap text-gray-500/,
    );
  });
});
