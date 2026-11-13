import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  OfficePersonRef,
  ServerOffice,
  ServerOfficeDetail,
} from "@/types/offices";
import {
  coerceOfficePersonRefs,
  createdDaysAgo,
  officeStatusFromServer,
  toUiOffice,
  toUiOfficeFromDetail,
} from "./mapServerOffice";

const baseRow: ServerOffice = {
  id: "office-1",
  company_id: "company-1",
  name: "Lagos HQ",
  street_address: "1 Marina Road",
  country: "Nigeria",
  state: "Lagos",
  currency_code: "NGN",
  currency_inherited: true,
  type: "physical",
  status: "active",
  is_primary: false,
  entity: {
    id: "entity-1",
    name: "Rayda NG",
    billing_currency: "USD",
    country: "Nigeria",
  },
  areas: [],
  created_by: { first_name: "Ada", last_name: "Obi" },
  created_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  updated_at: new Date().toISOString(),
};

describe("toUiOffice", () => {
  it("maps a physical server office onto the UI shape", () => {
    const office = toUiOffice(baseRow);

    assert.equal(office.id, "office-1");
    assert.equal(office.subsidiaryId, "entity-1");
    assert.equal(office.subsidiaryName, "Rayda NG");
    assert.equal(office.type, "Physical");
    assert.equal(office.currency, "NGN");
    assert.equal(office.address, "1 Marina Road");
    assert.equal(office.status, "active");
    assert.equal(office.createdDaysAgo, 3);
    assert.equal(office.createdBy, "Ada Obi");
  });

  it("falls back to entity billing currency and company id", () => {
    const office = toUiOffice({
      ...baseRow,
      entity: { id: "entity-1", name: "Rayda NG", billing_currency: "USD" },
      currency_code: null,
      country: null,
    });

    assert.equal(office.currency, "USD");
    assert.equal(office.region, "");

    const noEntity = toUiOffice({ ...baseRow, entity: null });
    assert.equal(noEntity.subsidiaryId, "company-1");
  });

  it("maps remote offices without an address", () => {
    const office = toUiOffice({
      ...baseRow,
      type: "remote",
      street_address: null,
    });

    assert.equal(office.type, "Remote");
    assert.equal(office.address, undefined);
  });
});

describe("officeStatusFromServer", () => {
  it("normalizes status tokens", () => {
    assert.equal(officeStatusFromServer("Closed"), "closed");
    assert.equal(officeStatusFromServer("shutting-down"), "shutting_down");
    assert.equal(officeStatusFromServer("anything-else"), "active");
  });
});

describe("createdDaysAgo", () => {
  it("returns undefined for missing or invalid dates", () => {
    assert.equal(createdDaysAgo(undefined), undefined);
    assert.equal(createdDaysAgo("not-a-date"), undefined);
  });

  it("never returns negative values", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    assert.equal(createdDaysAgo(future), 0);
  });
});

describe("toUiOfficeFromDetail", () => {
  it("maps office admins to display names", () => {
    const detail: ServerOfficeDetail = {
      ...baseRow,
      snapshot: { employees: 0, assets: 0, asset_value: 0, asset_mix: [] },
      office_admins: [
        { name: "Ada Obi" },
        { first_name: "John", last_name: "Doe" },
        { email: "no-name@rayda.co" },
      ],
      close_readiness: {
        can_close: true,
        employees: 0,
        assets: 0,
        blockers: [],
      },
    };

    assert.deepEqual(toUiOfficeFromDetail(detail).officeAdmins, [
      "Ada Obi",
      "John Doe",
      "no-name@rayda.co",
    ]);
  });

  it("reads admins when office_admins is missing", () => {
    const detail = {
      ...baseRow,
      snapshot: { employees: 0, assets: 0, asset_value: 0, asset_mix: [] },
      admins: [{ first_name: "Jane", last_name: "Smith" }],
      close_readiness: {
        can_close: true,
        employees: 0,
        assets: 0,
        blockers: [],
      },
    } as ServerOfficeDetail & { admins: OfficePersonRef[] };

    assert.deepEqual(toUiOfficeFromDetail(detail).officeAdmins, ["Jane Smith"]);
  });

  it("does not crash when admin fields are missing or malformed", () => {
    const detail = {
      ...baseRow,
      snapshot: { employees: 0, assets: 0, asset_value: 0, asset_mix: [] },
      office_admins: null,
      close_readiness: {
        can_close: true,
        employees: 0,
        assets: 0,
        blockers: [],
      },
    } as ServerOfficeDetail;

    assert.deepEqual(toUiOfficeFromDetail(detail).officeAdmins, []);
    assert.deepEqual(coerceOfficePersonRefs(undefined), []);
    assert.deepEqual(
      coerceOfficePersonRefs({ email: "solo@rayda.co" }).map(
        (admin) => admin.email,
      ),
      ["solo@rayda.co"],
    );
  });
});
