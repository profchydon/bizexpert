import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const controllerSource = readFileSync(
  join(dir, "useOrdersTabController.ts"),
  "utf8",
);
const ordersApiSource = readFileSync(
  join(dir, "useStorageOrdersApi.ts"),
  "utf8",
);
const inventorySource = readFileSync(
  join(dir, "useStorageInventoryApi.ts"),
  "utf8",
);

describe("useOrdersTabController", () => {
  it("debounces search before syncing with the orders endpoint", () => {
    assert.match(
      controllerSource,
      /useDebounce\(search, STORAGE_SEARCH_DEBOUNCE_MS\)/,
    );
    assert.match(controllerSource, /debouncedSearch,/);
  });

  it("resets pagination when debounced search or filters change", () => {
    assert.match(
      controllerSource,
      /useResetTablePage\(setPage, debouncedSearch, movement, statusTab\)/,
    );
  });

  it("sends only the trimmed search string to the orders endpoint", () => {
    assert.match(ordersApiSource, /const search = debouncedSearch\.trim\(\)/);
    assert.match(ordersApiSource, /search: hasSearch \? search : undefined/);
    assert.doesNotMatch(ordersApiSource, /useStorageOrdersSearchFallback/);
    assert.doesNotMatch(ordersApiSource, /storageOrderMatchesSearch/);
    assert.doesNotMatch(ordersApiSource, /isStorageOrdersSearchMiss/);
    assert.doesNotMatch(ordersApiSource, /normalizeStorageSearchQuery/);
    assert.doesNotMatch(ordersApiSource, /ACTIVE_ORDER_STATUSES\.includes/);
  });
});

describe("useStorageInventoryApi search debounce", () => {
  it("uses the shared storage search debounce constant", () => {
    assert.match(inventorySource, /useDebounce\([\s\S]*filters\.search/);
    assert.match(inventorySource, /STORAGE_SEARCH_DEBOUNCE_MS/);
  });
});
