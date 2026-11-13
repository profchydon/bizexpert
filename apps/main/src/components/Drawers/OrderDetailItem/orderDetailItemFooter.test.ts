import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("OrderDetailItem footer", () => {
  const source = readFileSync(
    join(process.cwd(), "src/components/Drawers/OrderDetailItem/index.tsx"),
    "utf8",
  );

  it("keeps one closed Back and Cancel footer", () => {
    assert.equal((source.match(/<Button\b/g) ?? []).length, 3);
    assert.equal((source.match(/<\/Button>/g) ?? []).length, 3);
    assert.equal(
      (source.match(/className="fixed bottom-0 left-0 right-0/g) ?? []).length,
      1,
    );
    assert.match(source, /<span[^>]*>Back<\/span>/);
    assert.match(source, />\s*Cancel\s*<\/Button>/);
    assert.doesNotMatch(source, /IUserRole/);
    assert.doesNotMatch(source, /useAuthUserDetail/);
  });
});
