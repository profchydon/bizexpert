import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EntityDetailApiRecord } from "./entityDetailTypes";
import { mapEntityCloseReadinessChecks } from "./mapEntityCloseReadiness";
import { mapEntityCostCentreSpend } from "./mapEntityCostCentreSpend";
import { mapEntityDetailToSubsidiary } from "./mapEntityDetailToSubsidiary";
import {
  mapEntityAdminLabels,
  mapEntityAdminUserIds,
  mapEntityPersonLabel,
} from "./mapEntityPersonLabel";

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
  parent: {
    id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
    name: "Intensa",
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
      {
        code: "no_active_offices",
        passed: true,
        count: 0,
        message: "No active offices under this entity",
      },
      {
        code: "no_outstanding_ar",
        passed: true,
        count: 0,
        message: "No outstanding receivables (AR)",
      },
    ],
    blockers: [],
  },
  created_at: "2026-08-11T15:29:45.000000Z",
  updated_at: "2026-08-11T15:29:45.000000Z",
};

describe("mapEntityPersonLabel", () => {
  it("joins first and last name", () => {
    assert.equal(mapEntityPersonLabel(detailRecord.created_by), "Joe Andy");
  });

  it("falls back to email when names are missing", () => {
    assert.equal(
      mapEntityPersonLabel({ id: "1", email: "only@example.com" }),
      "only@example.com",
    );
  });
});

describe("mapEntityDetailToSubsidiary", () => {
  it("maps admins and created_by from the detail payload", () => {
    const subsidiary = mapEntityDetailToSubsidiary(detailRecord);

    assert.deepEqual(subsidiary.admins, ["Obi John"]);
    assert.equal(subsidiary.createdBy, "Joe Andy");
    assert.equal(subsidiary.region, "Nigeria");
    assert.equal(subsidiary.currency, "USD");
  });
});

describe("mapEntityCostCentreSpend", () => {
  it("maps spend rows and coalesces null amounts to zero", () => {
    const spend = mapEntityCostCentreSpend(detailRecord.cost_centre_spend);

    assert.equal(spend.rows.length, 1);
    assert.equal(spend.rows[0]?.name, "Intensa Nigeria 3");
    assert.equal(spend.rows[0]?.region, "Nigeria");
    assert.equal(spend.rows[0]?.spendThisMonth, 0);
    assert.equal(spend.totalThisMonth, 0);
  });

  it("maps country objects on spend rows", () => {
    const spend = mapEntityCostCentreSpend({
      entities: [
        {
          id: "entity-1",
          name: "Intensa Nigeria 3",
          country: {
            id: "ng-1",
            name: "Nigeria",
            code: "NG",
            currency_code: "NGN",
            currency_symbol: "₦",
            payment_processor: "stripe",
          },
          spend_this_month: 120,
        },
      ],
      total_this_month: 120,
    });

    assert.equal(spend.rows[0]?.region, "Nigeria");
  });
});

describe("mapEntityCloseReadinessChecks", () => {
  it("maps API checks to pre-flight rows", () => {
    const checks = mapEntityCloseReadinessChecks(
      detailRecord.close_readiness?.checks,
    );

    assert.equal(checks.length, 3);
    assert.equal(
      checks.every((check) => check.ok),
      true,
    );
    assert.equal(checks[0]?.label, "Initiated by an authorized admin");
  });

  it("adds blocked copy when a check fails", () => {
    const checks = mapEntityCloseReadinessChecks([
      {
        code: "no_active_offices",
        passed: false,
        message: "Active offices exist",
        count: 2,
      },
    ]);

    assert.equal(checks[0]?.ok, false);
    assert.match(checks[0]?.blocked ?? "", /Shut them down/);
  });
});

describe("mapEntityAdminLabels", () => {
  it("returns an empty array when admins are missing", () => {
    assert.deepEqual(mapEntityAdminLabels(undefined), []);
  });
});

describe("mapEntityAdminUserIds", () => {
  it("maps admin ids from the detail payload", () => {
    assert.deepEqual(
      mapEntityAdminUserIds([
        { id: "admin-1", first_name: "Obi", last_name: "John" },
      ]),
      ["admin-1"],
    );
  });
});
