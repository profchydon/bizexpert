import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  cardGatewayFee,
  CREDIT_LOADING_NOTE,
  DELEGATED_CREDIT_NOTE,
  NO_CREDIT_NOTE,
  PLAN_BLOCKED_NOTE,
  resolveBilledEntityName,
  resolveCheckoutCredit,
  resolveOpenMethod,
} from "./checkoutMethods";

const own = (available: number) =>
  ({ kind: "own", wallet: { available, limit: 10000 } }) as const;

describe("resolveCheckoutCredit", () => {
  it("covers the order when the available credit is enough", () => {
    const credit = resolveCheckoutCredit({
      view: own(5000),
      total: 1200,
      isProcure: false,
      symbol: "$",
    });

    assert.equal(credit.isAvailable, true);
    assert.equal(credit.isShort, false);
    assert.equal(credit.shortfall, 0);
    assert.match(credit.note, /\$5,000\.00 available\./);
  });

  it("reports the shortfall when the credit does not cover the order", () => {
    const credit = resolveCheckoutCredit({
      view: own(1000.25),
      total: 1200,
      isProcure: false,
      symbol: "$",
    });

    assert.equal(credit.isAvailable, true);
    assert.equal(credit.isShort, true);
    assert.equal(credit.shortfall, 199.75);
  });

  it("blocks credit on Procure whatever the wallet holds", () => {
    const credit = resolveCheckoutCredit({
      view: own(5000),
      total: 100,
      isProcure: true,
      symbol: "$",
    });

    assert.equal(credit.isAvailable, false);
    assert.equal(credit.note, PLAN_BLOCKED_NOTE);
  });

  it("blocks credit while loading and when the account has none", () => {
    assert.equal(
      resolveCheckoutCredit({
        view: { kind: "loading" },
        total: 100,
        isProcure: false,
        symbol: "$",
      }).note,
      CREDIT_LOADING_NOTE,
    );
    const empty = resolveCheckoutCredit({
      view: { kind: "empty" },
      total: 100,
      isProcure: false,
      symbol: "$",
    });
    assert.equal(empty.isAvailable, false);
    assert.equal(empty.note, NO_CREDIT_NOTE);
  });

  it("lets a delegated entity pay on credit without showing the balance", () => {
    const credit = resolveCheckoutCredit({
      view: { kind: "delegated" },
      total: 100,
      isProcure: false,
      symbol: "$",
    });

    assert.equal(credit.isAvailable, true);
    assert.equal(credit.isShort, false);
    assert.equal(credit.available, null);
    assert.equal(credit.note, DELEGATED_CREDIT_NOTE);
  });
});

describe("resolveOpenMethod", () => {
  it("opens the row matching the chosen tab", () => {
    assert.equal(
      resolveOpenMethod({
        tab: "Credit",
        isCardAvailable: true,
        isCreditAvailable: true,
      }),
      "Credit",
    );
    assert.equal(
      resolveOpenMethod({
        tab: "Card",
        isCardAvailable: true,
        isCreditAvailable: true,
      }),
      "Card",
    );
  });

  it("falls back to card when credit cannot be used, and to credit when card cannot", () => {
    assert.equal(
      resolveOpenMethod({
        tab: "Credit",
        isCardAvailable: true,
        isCreditAvailable: false,
      }),
      "Card",
    );
    assert.equal(
      resolveOpenMethod({
        tab: "Card",
        isCardAvailable: false,
        isCreditAvailable: true,
      }),
      "Credit",
    );
    assert.equal(
      resolveOpenMethod({
        tab: "Card",
        isCardAvailable: false,
        isCreditAvailable: false,
      }),
      null,
    );
  });
});

describe("resolveBilledEntityName", () => {
  const memberships = [
    {
      id: "parent",
      name: "Amor di Sole",
      is_primary: true,
      parent_company_id: null,
    },
    {
      id: "rayda",
      name: "Rayda Inc",
      is_primary: false,
      parent_company_id: "parent",
    },
    {
      id: "ng",
      name: "Rayda Nigeria",
      is_primary: false,
      parent_company_id: "parent",
      billing_arrangement: { mode: "delegated" },
    },
  ];

  it("names the entity that owns the office being ordered for", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [{ id: "rayda", name: "Rayda Inc" }],
        memberships,
        activeEntityId: null,
        companyName: "Amor di Sole",
      }),
      "Rayda Inc",
    );
  });

  it("names the parent when the office's entity bills through it", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [{ id: "ng" }],
        memberships,
        companyName: "Amor di Sole",
      }),
      "Amor di Sole",
    );
  });

  it("uses the office entity name when the user has no membership on it", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [{ id: "other", name: "Other Ltd" }],
        memberships,
      }),
      "Other Ltd",
    );
  });

  it("lists each paying entity once when offices span entities", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [
          { id: "rayda", name: "Rayda Inc" },
          { id: "rayda", name: "Rayda Inc" },
          { id: "other", name: "Other Ltd" },
        ],
        memberships,
      }),
      "Rayda Inc and Other Ltd",
    );
  });

  it("uses the company name for people orders, not the primary entity", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [],
        memberships,
        companyName: "Rayda Holdings",
      }),
      "Rayda Holdings",
    );
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [],
        memberships,
        activeEntityId: "parent",
        companyName: "Rayda Holdings",
      }),
      "Rayda Holdings",
    );
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [],
        memberships: [],
        companyName: "Solo Co",
      }),
      "Solo Co",
    );
  });

  it("names the active workspace entity when it is not the primary", () => {
    assert.equal(
      resolveBilledEntityName({
        officeEntities: [],
        memberships,
        activeEntityId: "rayda",
        companyName: "Rayda Holdings",
      }),
      "Rayda Inc",
    );
  });
});

describe("cardGatewayFee", () => {
  it("reads the payment gateway fee from the card fee summary", () => {
    assert.equal(cardGatewayFee({ payment_gateway_fee: 36 }), 36);
    assert.equal(cardGatewayFee({ payment_gateway_fee: "12.5" }), 12.5);
  });

  it("returns null when there is no fee", () => {
    assert.equal(cardGatewayFee({ payment_gateway_fee: 0 }), null);
    assert.equal(cardGatewayFee({}), null);
    assert.equal(cardGatewayFee(undefined), null);
  });
});

describe("OrderSummaryPaymentDrawer", () => {
  const drawer = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryPaymentDrawer.tsx",
    ),
    "utf8",
  );

  it("uses the design-ui slideout with card, bank transfer and Rayda credit rows", () => {
    assert.match(drawer, /<SlideoutMenu/);
    assert.match(drawer, /title="Card"/);
    assert.match(drawer, /title="Bank transfer"/);
    assert.match(drawer, /title="Rayda credit"/);
    assert.doesNotMatch(drawer, /Drawers\/PaymentMethods"/);
  });

  it("keeps bank transfer disabled with no panel to open", () => {
    const bankRow = drawer.slice(
      drawer.indexOf('title="Bank transfer"'),
      drawer.indexOf('title="Rayda credit"'),
    );

    assert.match(bankRow, /\bisDisabled\n/);
    assert.match(bankRow, /isOpen=\{false\}/);
    assert.match(bankRow, /Coming soon/);
    assert.doesNotMatch(bankRow, /setTabState/);
  });

  it("bills the order's office entity and shows the card fee on the card row", () => {
    const panels = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/PaymentDrawer/MethodPanels.tsx",
      ),
      "utf8",
    );

    assert.match(drawer, /useGetDeliverableOfficesQuery/);
    assert.match(drawer, /resolveBilledEntityName\(/);
    assert.match(drawer, /cardGatewayFee\(totalFeesSummary\)/);
    assert.match(panels, /label: "Card processing fee"/);
  });
});
