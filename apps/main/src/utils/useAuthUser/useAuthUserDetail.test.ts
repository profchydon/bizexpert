import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("useAuthUserDetail", () => {
  it("calls useAppSelector only inside the hook body", () => {
    const source = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

    assert.match(source, /export const useAuthUserDetail = \(\) => \{/);
    assert.match(
      source,
      /const encryptedAuthdata = useAppSelector\([\s\S]*?\);/,
    );
    assert.doesNotMatch(
      source,
      /const getAuthDetails = \(\) => \{[\s\S]*useAppSelector/,
    );
  });
});
