import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("getStorageActionFees", () => {
  it("posts payment_method and country_id to the workspace-scoped preview", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/feesApi/getStorageActionFees.ts",
      ),
      "utf8",
    );

    assert.match(source, /\/\$\{companyId\}\/fees\/storage\/actions/);
    assert.match(source, /method: "POST"/);
    assert.match(source, /payment_method: StorageActionFeePaymentMethod/);
    assert.match(source, /country_id: string/);
    assert.match(source, /orders: StorageActionFeeOrder\[\]/);
    assert.match(source, /query: \(\{ companyId, \.\.\.payload \}\)/);
    assert.match(source, /data: payload/);
    assert.doesNotMatch(source, /data: \{\}/);
  });

  it("is registered when the store boots", () => {
    const store = readFileSync(
      join(process.cwd(), "src/store/store.ts"),
      "utf8",
    );

    assert.match(store, /feesApi\/getStorageActionFees/);
  });
});
