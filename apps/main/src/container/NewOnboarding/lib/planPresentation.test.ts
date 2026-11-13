import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { IPlan } from "@/types/plans";
import {
  billingSummary,
  planColumns,
  planFeatureMatrix,
} from "./planPresentation";

function plan(
  slug: string,
  name: string,
  amount: number,
  features: string[],
  description = "",
  offers: string[] = [],
): IPlan {
  return {
    id: slug,
    name,
    description,
    preceding_plan_name: null,
    features: features.map((feature) => ({
      id: feature,
      name: feature,
      description: "",
      available_as_addon: false,
      pricing: "Paid",
      status: "Active",
      created_at: "",
      updated_at: "",
      deleted_at: null,
      laravel_through_key: slug,
    })),
    price: {
      id: `${slug}-price`,
      plan_id: slug,
      currency_code: "NGN",
      amount: String(amount),
      billing_cycle: "Yearly",
      slug: `${slug}-ngn-yearly`,
      plan_slug: slug,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
    offers,
    slug,
    status: "Active",
  };
}

const apiPlans = [
  plan(
    "procure",
    "Procure",
    0,
    ["Seat", "Rayda Care"],
    "Popular plan for small",
    ["Unlimited employees", "Up to 1 seats"],
  ),
  plan("manage", "Manage", 5500000, ["Seat", "Credit", "Office"]),
  plan("operate", "Operate", 11000000, ["Catalog", "Seat", "Credit"]),
];

test("columns follow the api response order and carry the api price", () => {
  const cols = planColumns(apiPlans);

  assert.deepEqual(
    cols.map((col) => col.slug),
    ["procure", "manage", "operate"],
  );
  assert.equal(cols[0].label, "Procure (Free)");
  assert.equal(cols[1].label, "Manage (NGN 5,500,000.00/yearly)");
});

test("feature rows are the union of every plan's api features", () => {
  const rows = planFeatureMatrix(apiPlans);

  assert.deepEqual(
    rows.map((row) => row.name),
    ["Seat", "Rayda Care", "Credit", "Office", "Catalog"],
  );
});

test("a feature is ticked only for the plans the api lists it under", () => {
  const rows = planFeatureMatrix(apiPlans);
  const office = rows.find((row) => row.name === "Office");

  assert.equal(office?.includedIn.manage, true);
  assert.equal(office?.includedIn.procure, false);
  assert.equal(office?.includedIn.operate, false);
});

test("a duplicated feature name is not repeated as two rows", () => {
  const rows = planFeatureMatrix(apiPlans);
  const seats = rows.filter((row) => row.name === "Seat");

  assert.equal(seats.length, 1);
  assert.equal(seats[0].includedIn.procure, true);
});

test("plans without features do not break the matrix", () => {
  const rows = planFeatureMatrix([plan("lite", "Lite", 0, [])]);

  assert.deepEqual(rows, []);
});

test("the billing line states the api cycle, not a hardcoded monthly", () => {
  const summary = billingSummary(apiPlans);

  assert.match(summary, /billed yearly/);
  assert.equal(summary.includes("monthly"), false);
});

test("the free plan named in the summary is the one the api prices at zero", () => {
  assert.match(billingSummary(apiPlans), /Start free on Procure\./);
});

test("mixed billing cycles drop the cycle claim instead of guessing", () => {
  const monthly = plan("manage", "Manage", 100, []);
  monthly.price.billing_cycle = "Monthly";

  const summary = billingSummary([apiPlans[0], monthly]);

  assert.equal(summary.includes("billed"), false);
  assert.match(summary, /Start free on Procure\./);
});

test("no free plan means no free claim", () => {
  const summary = billingSummary([apiPlans[1], apiPlans[2]]);

  assert.equal(summary.includes("Start free"), false);
  assert.match(summary, /billed yearly/);
});

test("the hardcoded plan copy and feature tables are gone", () => {
  const step = readFileSync(
    "src/container/NewOnboarding/Setup/PlanSelectionStep.tsx",
    "utf8",
  );
  const card = readFileSync(
    "src/container/NewOnboarding/Setup/components/PlanCard.tsx",
    "utf8",
  );

  assert.equal(step.includes("PLAN_COPY"), false);
  assert.equal(step.includes("ONBOARDING_PLAN_FEATURES"), false);
  assert.equal(step.includes("BYOD_BILLING_NOTE"), false);
  assert.equal(step.includes("PLAN_ORDER"), false);
  assert.equal(card.includes("PlanCopyEntry"), false);
  assert.match(card, /plan\.offers/);
  assert.match(card, /plan\.description/);
});
