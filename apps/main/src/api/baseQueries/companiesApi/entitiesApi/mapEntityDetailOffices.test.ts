import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ServerOffice } from "@/types/offices";
import { mapEntityDetailOffices } from "./mapEntityDetailOffices";

const officeRow: ServerOffice = {
  id: "office-1",
  company_id: "company-9",
  name: "London HQ 1",
  street_address: "1 High Street",
  country: "United Kingdom",
  state: null,
  currency_code: "GBP",
  currency_inherited: true,
  type: "physical",
  status: "active",
  is_primary: false,
  entity: null,
  areas: [],
  created_at: "2026-08-11T15:29:45.000000Z",
  updated_at: "2026-08-11T15:29:45.000000Z",
};

describe("mapEntityDetailOffices", () => {
  it("uses the parent entity id when office rows omit entity refs", () => {
    const offices = mapEntityDetailOffices(
      [officeRow],
      "entity-42",
      "Acme UK Ltd",
    );

    assert.equal(offices[0]?.id, "office-1");
    assert.equal(offices[0]?.subsidiaryId, "entity-42");
    assert.equal(offices[0]?.subsidiaryName, "Acme UK Ltd");
    assert.equal(offices[0]?.type, "Physical");
    assert.equal(offices[0]?.status, "active");
  });

  it("keeps a closed office visible so the entity list can mark it", () => {
    const offices = mapEntityDetailOffices(
      [{ ...officeRow, id: "01a0344b", name: "Primary 2", status: "closed" }],
      "01a01ebb",
      "Intensa United Kingdom 18",
    );

    assert.equal(offices[0]?.status, "closed");
    assert.equal(offices[0]?.name, "Primary 2");
  });

  it("keeps nested entity refs when the API includes them", () => {
    const nested: ServerOffice = {
      ...officeRow,
      entity: {
        id: "entity-nested",
        name: "Nested Entity",
        billing_currency: "EUR",
        country: "France",
      },
    };

    const offices = mapEntityDetailOffices(
      [nested],
      "entity-42",
      "Acme UK Ltd",
    );

    assert.equal(offices[0]?.subsidiaryId, "entity-nested");
    assert.equal(offices[0]?.subsidiaryName, "Nested Entity");
  });
});
