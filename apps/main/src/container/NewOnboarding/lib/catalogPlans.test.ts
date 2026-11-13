import { strict as assert } from "node:assert";
import { test } from "node:test";
import { catalogGroups, catalogPlans } from "./catalogPlans";
import { planPriceLabel, planRequiresPayment } from "./planPricing";

const catalog = {
  plans: [
    {
      id: "procure",
      name: "Procure",
      slug: "procure",
      tagline: "Source devices anywhere.",
      highlights: ["Marketplace", "RFQ"],
      price: {
        amount: "0.00",
        currency: "USD",
        interval: "month",
        display: "Free",
      },
    },
    {
      id: "manage",
      name: "Manage",
      slug: "manage",
      highlights: ["Fleet"],
      price: {
        amount: "7.00",
        currency: "USD",
        interval: "month",
        unit: "device",
        display: "$7/device/mo",
      },
    },
    { id: "", slug: "" },
  ],
  groups: [
    {
      key: "limits",
      name: "Organisational limits",
      features: [
        {
          code: "offices",
          name: "Offices",
          cells: [
            { plan: "procure", kind: "value", label: "1" },
            { plan: "manage", kind: "value", label: "5" },
            { plan: "other", kind: "maybe", label: "no" },
          ],
        },
      ],
    },
  ],
};

test("catalog plans are read from the plans object, not a flat list", () => {
  const plans = catalogPlans(catalog);

  assert.deepEqual(
    plans.map((plan) => plan.slug),
    ["procure", "manage"],
  );
  assert.equal(plans[0]?.description, "Source devices anywhere.");
  assert.deepEqual(plans[0]?.offers, ["Marketplace", "RFQ"]);
  assert.equal(plans[1]?.price.billing_cycle, "Monthly");
});

test("a wrapped plans response and a legacy array both resolve", () => {
  assert.equal(catalogPlans({ data: catalog }).length, 2);
  assert.equal(
    catalogPlans([
      { id: "scale", name: "Scale", slug: "scale", offers: ["All"] },
    ]).length,
    1,
  );
  assert.deepEqual(catalogPlans(undefined), []);
  assert.deepEqual(catalogPlans({ groups: [] }), []);
});

test("comparison groups come from the plans payload", () => {
  const groups = catalogGroups(catalog);

  assert.equal(groups[0]?.name, "Organisational limits");
  assert.equal(groups[0]?.features[0]?.cells[0]?.label, "1");
  assert.equal(groups[0]?.features[0]?.cells.length, 2);
  assert.deepEqual(catalogGroups({ data: catalog })[0]?.key, "limits");
  assert.deepEqual(catalogGroups(undefined), []);
});

test("a numeric plan amount is kept for the payment check", () => {
  const plans = catalogPlans({
    plans: [
      {
        id: "operate",
        name: "Operate",
        slug: "operate",
        price: { amount: 11 },
      },
    ],
  });

  assert.equal(plans[0]?.price.amount, "11");
  assert.equal(planRequiresPayment(plans[0]), true);
});

test("the card price splits a per-device display into amount and suffix", () => {
  const plans = catalogPlans(catalog);

  assert.deepEqual(planPriceLabel(plans[0]), { amount: "Free", suffix: "" });
  assert.deepEqual(planPriceLabel(plans[1]), {
    amount: "$7",
    suffix: "/device/mo",
  });
});
