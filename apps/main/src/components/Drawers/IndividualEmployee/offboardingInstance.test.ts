import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("OffboardingInstance", () => {
  it("does not reference IUserRole after notes became customer-visible", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/IndividualEmployee/OffboardingInstance.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(source, /IUserRole/);
    assert.doesNotMatch(source, /useAuthUserDetail/);
  });
});
