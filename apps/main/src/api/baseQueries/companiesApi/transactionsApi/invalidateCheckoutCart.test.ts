import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const PAYMENTS = [
  "buyToStoragePayment.ts",
  "onboardingPayment.ts",
  "equipEmployeePayment.ts",
  "storageActionsPayment.ts",
];

describe("invalidateCheckoutCart", () => {
  it("clears the cart slice after a successful checkout", () => {
    const helper = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/transactionsApi/invalidateCheckoutCart.ts",
      ),
      "utf8",
    );
    assert.match(helper, /cartApi\.util\.invalidateTags\(\["Cart"\]\)/);

    for (const file of PAYMENTS) {
      const source = readFileSync(
        join(
          process.cwd(),
          "src/api/baseQueries/companiesApi/transactionsApi",
          file,
        ),
        "utf8",
      );
      assert.match(source, /invalidatesTags: \["Order"\]/);
      assert.match(source, /invalidateCheckoutCart\(dispatch\)/);
      assert.doesNotMatch(source, /"Cart"/);
    }
  });
});
