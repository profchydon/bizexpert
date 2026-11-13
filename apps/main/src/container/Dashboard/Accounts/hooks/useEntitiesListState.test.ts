import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "useEntitiesListState.ts"), "utf8");

describe("useEntitiesListState", () => {
  it("debounces search before syncing with the entities endpoint", () => {
    assert.match(source, /useDebounce\(search, ENTITIES_SEARCH_DEBOUNCE_MS\)/);
    assert.match(source, /ENTITIES_SEARCH_DEBOUNCE_MS = 400/);
  });

  it("resets pagination when debounced search or filters change", () => {
    assert.match(
      source,
      /useResetTablePage\(setPage, debouncedSearch, statuses\)/,
    );
  });
});
