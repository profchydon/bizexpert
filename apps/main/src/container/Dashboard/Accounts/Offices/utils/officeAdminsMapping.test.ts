import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ServerOfficeDetail } from "@/types/offices";
import {
  coerceOfficePersonRefs,
  toUiOfficeFromDetail,
} from "./mapServerOffice";

const detailWithAdmins = (
  officeAdmins: ServerOfficeDetail["office_admins"],
): ServerOfficeDetail => ({
  id: "019ffbb3-8dd9-70e5-b211-5cc42dc5777d",
  company_id: "019ffba9-2ec0-73d2-8b89-5c5c7d237a39",
  name: "London HQ 1",
  street_address: "4b, London street",
  country: "United Kingdom",
  state: null,
  currency_code: "USD",
  currency_inherited: true,
  type: "physical",
  status: "Active",
  is_primary: false,
  entity: {
    id: "019ffba9-2ec0-73d2-8b89-5c5c7d237a39",
    name: "Intensa United Kingdom 11",
    billing_currency: "USD",
    country: "United Kingdom",
  },
  areas: [],
  snapshot: { employees: 0, assets: 0, asset_value: 0, asset_mix: [] },
  office_admins: officeAdmins,
  created_by: {
    id: "9de974c6-8102-4e95-8fe3-671cbd5a5861",
    first_name: "Joe",
    last_name: "Andy",
    email: "joeandy@yopmail.com",
  },
  close_readiness: { can_close: true, employees: 0, assets: 0, blockers: [] },
  created_at: "2026-08-13T15:17:56.000000Z",
  updated_at: "2026-08-13T15:17:56.000000Z",
});

describe("office admins mapping", () => {
  it("reads admins from the paginated office_admins envelope", () => {
    const office = toUiOfficeFromDetail(
      detailWithAdmins({
        data: [
          {
            id: "019f08d4-a3c7-7274-ba17-b38879e8d856",
            first_name: "Kingdom",
            last_name: "Two",
            email: "kingdom2@yopmail.com",
          },
        ],
        total: 1,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      }),
    );

    assert.deepEqual(office.officeAdmins, ["Kingdom Two"]);
  });

  it("returns no admins for an empty envelope", () => {
    const office = toUiOfficeFromDetail(
      detailWithAdmins({ data: [], total: 0, per_page: 10, current_page: 1 }),
    );

    assert.deepEqual(office.officeAdmins, []);
    assert.deepEqual(coerceOfficePersonRefs({ data: null }), []);
  });

  it("keeps an id per admin so each one can link to its employee page", () => {
    const office = toUiOfficeFromDetail(
      detailWithAdmins({
        data: [
          {
            id: "019f08d4-a3c7-7274-ba17-b38879e8d856",
            first_name: "Kingdom",
            last_name: "Two",
          },
          { id: "019ffb9d-024d-734b-a00b-360ff8cbf75d", name: "Ada Obi" },
          { name: "No Id Admin" },
        ],
      }),
    );

    assert.deepEqual(office.officeAdminRefs, [
      { id: "019f08d4-a3c7-7274-ba17-b38879e8d856", name: "Kingdom Two" },
      { id: "019ffb9d-024d-734b-a00b-360ff8cbf75d", name: "Ada Obi" },
      { id: undefined, name: "No Id Admin" },
    ]);
    assert.deepEqual(office.officeAdmins, [
      "Kingdom Two",
      "Ada Obi",
      "No Id Admin",
    ]);
  });

  it("falls back to the email when the admin has no name parts", () => {
    const office = toUiOfficeFromDetail(
      detailWithAdmins({ data: [{ email: "kingdom2@yopmail.com" }] }),
    );

    assert.deepEqual(office.officeAdmins, ["kingdom2@yopmail.com"]);
  });
});
