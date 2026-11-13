import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildKitAssetsParams } from "./devicePickerQueryParams";

describe("kit asset picker filters", () => {
  it("builds paginated kit assets requests", () => {
    assert.deepEqual(
      buildKitAssetsParams({
        categoryId: "cat-1",
        page: 2,
        search: "macbook",
      }),
      {
        category: "cat-1",
        page: 2,
        per_page: 20,
        search: "macbook",
      },
    );
  });

  it("omits empty server-side filters from kit assets requests", () => {
    assert.deepEqual(
      buildKitAssetsParams({
        categoryId: null,
        page: 1,
        search: "",
      }),
      {
        category: undefined,
        page: 1,
        per_page: 20,
        search: undefined,
      },
    );
  });
});
