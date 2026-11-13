import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OFFICE_DETAIL_ENTITY_PARAM,
  isOfficeDetailFromSubsidiary,
  officeCloseRedirectPath,
  officeDetailHref,
  resolveOfficeDetailEntityId,
} from "./officeDetailHref";

describe("officeDetailHref", () => {
  it("appends the owning entity id as entityId", () => {
    assert.equal(OFFICE_DETAIL_ENTITY_PARAM, "entityId");
    assert.equal(
      officeDetailHref({ id: "office-1", subsidiaryId: "entity-9" }),
      "/dashboard/accounts/offices/office-1?entityId=entity-9",
    );
  });

  it("encodes unsafe characters in the entity id", () => {
    assert.equal(
      officeDetailHref({ id: "office-1", subsidiaryId: "a b&c" }),
      "/dashboard/accounts/offices/office-1?entityId=a%20b%26c",
    );
  });

  it("omits the param when the office has no entity id", () => {
    assert.equal(
      officeDetailHref({ id: "office-1", subsidiaryId: "" }),
      "/dashboard/accounts/offices/office-1",
    );
  });

  it("marks links that started on the entity detail page", () => {
    assert.equal(
      officeDetailHref(
        { id: "office-1", subsidiaryId: "entity-9" },
        { fromSubsidiary: true },
      ),
      "/dashboard/accounts/offices/office-1?entityId=entity-9&from=subsidiary",
    );
  });
});

describe("officeCloseRedirectPath", () => {
  it("returns to the entity detail page when the visit started there", () => {
    assert.equal(
      officeCloseRedirectPath("entity-9", true),
      "/dashboard/accounts/subsidiaries/entity-9",
    );
  });

  it("keeps the offices tab when the visit did not start on the entity", () => {
    assert.equal(
      officeCloseRedirectPath("entity-9", false),
      "/dashboard/accounts?tab=offices",
    );
    assert.equal(isOfficeDetailFromSubsidiary("subsidiary"), true);
    assert.equal(isOfficeDetailFromSubsidiary("offices"), false);
  });
});

describe("resolveOfficeDetailEntityId", () => {
  it("prefers entityId over a leftover entity param", () => {
    assert.deepEqual(
      resolveOfficeDetailEntityId({
        entityId: "entity-new",
        entity: "entity-old",
      }),
      { entityId: "entity-new", rewriteLegacy: false },
    );
  });

  it("rewrites a legacy entity param so old office links still open", () => {
    assert.deepEqual(resolveOfficeDetailEntityId({ entity: "entity-9" }), {
      entityId: "entity-9",
      rewriteLegacy: true,
    });
  });

  it("returns nothing when neither param is present", () => {
    assert.deepEqual(resolveOfficeDetailEntityId({}), {
      entityId: undefined,
      rewriteLegacy: false,
    });
  });
});
