import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveOrderScopedCompanyId } from "./resolveOrderScopedCompanyId";

describe("resolveOrderScopedCompanyId", () => {
  it("prefers order company_id over workspace scope", () => {
    assert.equal(
      resolveOrderScopedCompanyId(
        { company_id: "entity-11" },
        "company-primary",
      ),
      "entity-11",
    );
  });

  it("falls back to subsidiary_id when company_id is missing", () => {
    assert.equal(
      resolveOrderScopedCompanyId(
        { subsidiary_id: "entity-13" },
        "company-primary",
      ),
      "entity-13",
    );
  });

  it("uses workspace company id when order has no scoped ids", () => {
    assert.equal(resolveOrderScopedCompanyId({}, "entity-11"), "entity-11");
  });
});
