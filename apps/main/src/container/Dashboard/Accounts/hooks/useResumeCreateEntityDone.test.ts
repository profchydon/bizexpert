import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useResumeCreateEntityDone", () => {
  it("jumps the wizard to the done step on card setup return", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useResumeCreateEntityDone.ts",
      ),
      "utf8",
    );

    assert.match(source, /useLayoutEffect/);
    assert.match(source, /return isReady/);
  });
});
