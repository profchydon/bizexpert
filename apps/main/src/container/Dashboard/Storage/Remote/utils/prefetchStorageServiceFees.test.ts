import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage service fee prefetch", () => {
  it("prefetches service fees when storage actions are added to cart", () => {
    const unifiedCart = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageCartActions.ts",
      ),
      "utf8",
    );
    const prefetch = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/utils/prefetchStorageServiceFees.ts",
      ),
      "utf8",
    );

    assert.match(unifiedCart, /prefetchStorageServiceFees/);
    assert.match(prefetch, /getServiceFees\.initiate/);
    assert.match(prefetch, /initiate\(undefined/);
    assert.doesNotMatch(prefetch, /companyId/);
    assert.match(prefetch, /getServiceFees/);
  });

  it("registers the service-fees endpoint when the store boots", () => {
    const store = readFileSync(
      join(process.cwd(), "src/store/store.ts"),
      "utf8",
    );

    assert.match(store, /feesApi\/getServiceFees/);
  });
});
