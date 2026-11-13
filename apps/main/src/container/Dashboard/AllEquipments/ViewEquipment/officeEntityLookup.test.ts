import assert from "node:assert/strict";
import { describe, it } from "node:test";
import routes from "@/routes";
import type { ServerOffice } from "@/types/offices";
import { officeDetailHref } from "../../Accounts/Offices/utils/officeDetailHref.ts";
import {
  findOfficeById,
  officeEntityId,
  officeEntityRef,
} from "./officeEntityLookup.ts";

const office = (fields: Partial<ServerOffice>) =>
  ({ id: "office-1", company_id: "company-1", ...fields }) as ServerOffice;

const company = { id: "9de974c6", name: "Rayda" };

const subEntityOffice = office({
  id: "019ffbc6",
  company_id: "9de974c6",
  entity: { id: "019ffa10", name: "Nigeria Entity" },
});

describe("officeEntityId", () => {
  it("uses the office entity id, not the company the office was fetched under", () => {
    assert.equal(officeEntityId(subEntityOffice), "019ffa10");
    assert.equal(
      officeDetailHref({
        id: "019ffbc6",
        subsidiaryId: officeEntityId(subEntityOffice),
      }),
      "/dashboard/accounts/offices/019ffbc6?entityId=019ffa10",
    );
  });

  it("falls back to the owning company when the office has no entity", () => {
    assert.equal(
      officeEntityId(office({ id: "office-2", company_id: "company-9" })),
      "company-9",
    );
  });

  it("returns nothing when no office resolved", () => {
    assert.equal(officeEntityId(undefined), "");
  });
});

describe("officeEntityRef", () => {
  it("returns the entity name and id, linking to the entity detail page", () => {
    const entity = officeEntityRef(subEntityOffice, company);

    assert.deepEqual(entity, { id: "019ffa10", name: "Nigeria Entity" });
    assert.equal(
      routes.SUBSIDIARY_DETAIL(entity!.id),
      "/dashboard/accounts/subsidiaries/019ffa10",
    );
  });

  it("names the workspace company for an office held directly by it", () => {
    assert.deepEqual(
      officeEntityRef(office({ company_id: "9de974c6" }), company),
      { id: "9de974c6", name: "Rayda" },
    );
  });

  it("returns nothing without an office or a resolvable name", () => {
    assert.equal(officeEntityRef(undefined, company), null);
    assert.equal(officeEntityRef(office({}), undefined), null);
    assert.equal(officeEntityRef(office({}), { id: "c-1" }), null);
  });
});

describe("findOfficeById", () => {
  it("matches the office in a list page", () => {
    assert.equal(
      findOfficeById([subEntityOffice], "019ffbc6"),
      subEntityOffice,
    );
  });

  it("returns nothing when the office is unknown or not requested", () => {
    assert.equal(findOfficeById([office({})], "missing"), undefined);
    assert.equal(findOfficeById(undefined, "office-1"), undefined);
    assert.equal(findOfficeById([office({})], undefined), undefined);
  });
});
