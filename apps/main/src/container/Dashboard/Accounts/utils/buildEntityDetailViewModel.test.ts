import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EntityDetailApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/entityDetailTypes";
import { buildEntityDetailViewModel } from "./buildEntityDetailViewModel";

const detailRecord: EntityDetailApiRecord = {
  id: "019ff171-a82a-70ce-9dce-7cf303ea1583",
  name: "Intensa Nigeria 2",
  email: "intensa.ng@yopmail.com",
  country: "Nigeria",
  parent_company_id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
  is_primary: false,
  billing_currency: "USD",
  billing_responsibility: "self",
  delegated_payer_id: null,
  lifecycle_status: "active",
  credit_state: "card_only",
  card_captured: false,
  permanent_card_only: false,
  billing_status_badge: "card_pending",
  credit_label: "card_only",
  credit_check: "pending",
  billing_arrangement: {
    mode: "self_billing",
    invoice_to: "this_entity",
    payment_method: "card_pending",
  },
  delegated_payer: null,
  admins: [
    {
      id: "019ff170-1d40-7270-b260-c9faea88a001",
      first_name: "Obi",
      last_name: "John",
      email: "obi.john@yopmail.com",
      role: "Administrator",
    },
  ],
  offices_count: 0,
  offices: [],
  created_by: {
    id: "9de974c6-8102-4e95-8fe3-671cbd5a5861",
    first_name: "Joe",
    last_name: "Andy",
    email: "joeandy@yopmail.com",
  },
  cost_centre_spend: {
    entities: [
      {
        id: "019ff180-9b13-71c7-948a-dbd50b6516f5",
        name: "Intensa Nigeria 3",
        country: "Nigeria",
        spend_this_month: null,
      },
    ],
    total_this_month: null,
  },
  close_readiness: {
    can_close: true,
    authorized_admin: true,
    active_offices: 0,
    outstanding_ar: 0,
    checks: [
      {
        code: "authorized_admin",
        passed: true,
        message: "Initiated by an authorized admin",
      },
    ],
    blockers: [],
  },
  created_at: "2026-08-11T15:29:45.000000Z",
  updated_at: "2026-08-11T15:29:45.000000Z",
};

describe("buildEntityDetailViewModel", () => {
  it("bundles subsidiary, close checks, spend, offices, and footprint", () => {
    const viewModel = buildEntityDetailViewModel({
      ...detailRecord,
      employees_count: 5,
      assets_count: 9,
    });

    assert.equal(viewModel.subsidiary.name, "Intensa Nigeria 2");
    assert.deepEqual(viewModel.adminUserIds, [
      "019ff170-1d40-7270-b260-c9faea88a001",
    ]);
    assert.deepEqual(viewModel.adminRows, [
      {
        id: "019ff170-1d40-7270-b260-c9faea88a001",
        name: "Obi John",
        email: "obi.john@yopmail.com",
      },
    ]);
    assert.equal(viewModel.closeChecks.length, 1);
    assert.equal(viewModel.costCentreSpend.length, 1);
    assert.equal(viewModel.costCentreTotal, 0);
    assert.deepEqual(viewModel.offices, []);
    assert.deepEqual(viewModel.footprint, { employees: 5, assets: 9 });
    assert.equal(viewModel.paymentProcessor, null);
  });

  it("maps admins from a paginated detail payload", () => {
    const viewModel = buildEntityDetailViewModel({
      ...detailRecord,
      admins: {
        data: [
          {
            id: "019f60df-77c2-720d-9ec0-59a73ce3a0fa",
            first_name: "Oyin",
            last_name: "Tope",
            email: "oyintope@yopmail.com",
            role: "Administrator",
          },
        ],
        total: 1,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      },
    });

    assert.deepEqual(viewModel.subsidiary.admins, ["Oyin Tope"]);
    assert.deepEqual(viewModel.adminUserIds, [
      "019f60df-77c2-720d-9ec0-59a73ce3a0fa",
    ]);
  });

  it("defaults footprint counts when the API omits them", () => {
    const viewModel = buildEntityDetailViewModel(detailRecord);

    assert.deepEqual(viewModel.footprint, { employees: 0, assets: 0 });
  });

  it("maps footprint counts from the nested footprint payload", () => {
    const viewModel = buildEntityDetailViewModel({
      ...detailRecord,
      footprint: {
        scope: "entity",
        company_id: detailRecord.id,
        employees: 1,
        assets: 0,
      },
    });

    assert.deepEqual(viewModel.footprint, { employees: 1, assets: 0 });
  });

  it("maps office previews with the parent entity id for detail links", () => {
    const viewModel = buildEntityDetailViewModel({
      ...detailRecord,
      offices: [
        {
          id: "office-1",
          company_id: "company-9",
          name: "London HQ 1",
          street_address: null,
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
        },
      ],
    });

    assert.equal(viewModel.offices[0]?.subsidiaryId, detailRecord.id);
    assert.equal(viewModel.offices[0]?.name, "London HQ 1");
  });
});
