import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ENTITIES_PAGE_SIZE } from "./entitiesPagination";

describe("entitiesPagination", () => {
  it("uses 15 entities per page", () => {
    assert.equal(ENTITIES_PAGE_SIZE, 15);
  });
});
