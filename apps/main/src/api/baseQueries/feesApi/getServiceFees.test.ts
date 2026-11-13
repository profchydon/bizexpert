import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("getServiceFees", () => {
  it("requests the global service-fees catalog", () => {
    const source = readFileSync(
      join(process.cwd(), "src/api/baseQueries/feesApi/getServiceFees.ts"),
      "utf8",
    );

    assert.match(source, /\$\{config\.API_URL\}\/fees\/service-fees/);
    assert.match(source, /void/);
    assert.doesNotMatch(source, /companyId/);
    assert.doesNotMatch(source, /\/companies\//);
    assert.match(source, /ServiceFeeStorage/);
    assert.match(source, /Resale\?: number/);
  });
});
