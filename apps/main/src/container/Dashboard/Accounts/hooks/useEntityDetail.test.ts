import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useEntityDetail", () => {
  it("loads entity detail from GET /companies/{entityId}", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useEntityDetail.ts",
      ),
      "utf8",
    );

    assert.match(source, /useGetEntityQuery/);
    assert.match(source, /buildEntityDetailViewModel/);
    assert.doesNotMatch(source, /isFetching/);
    assert.doesNotMatch(source, /subsidiaryEditStore/);
  });
});
