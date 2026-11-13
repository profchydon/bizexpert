import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("SubsidiaryDetailPageFallback", () => {
  it("uses the shared PageState loader like marketplace", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailPageFallback.tsx",
      ),
      "utf8",
    );

    assert.match(source, /PageState/);
    assert.match(source, /isLoading/);
  });
});
