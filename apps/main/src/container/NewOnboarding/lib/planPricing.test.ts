import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { IPlan } from "@/types/plans";
import {
  findFreePlan,
  findPlanBySlug,
  planPriceLabel,
  planRequiresPayment,
} from "./planPricing";
import { toList } from "./toList";

const plan = (slug: string, amount: number) =>
  ({
    id: slug,
    name: slug,
    slug,
    price: {
      id: `${slug}-price`,
      currency_code: "GBP",
      amount: String(amount),
      billing_cycle: "Yearly",
    },
  }) as unknown as IPlan;

test("a zero amount plan renders as free with no billing suffix", () => {
  assert.deepEqual(planPriceLabel(plan("procure", 0)), {
    amount: "Free",
    suffix: "",
  });
});

test("a paid plan renders the api currency, amount and billing cycle", () => {
  assert.deepEqual(planPriceLabel(plan("manage", 3588)), {
    amount: "GBP 3,588.00",
    suffix: "/yearly",
  });
});

test("a per-device price still requires payment when amount is zero", () => {
  const priced = plan("manage", 0);
  priced.price = {
    ...priced.price,
    display: "$7/device/mo",
  } as IPlan["price"];

  assert.equal(planRequiresPayment(priced), true);
  assert.equal(planRequiresPayment(plan("procure", 0)), false);
});

test("a missing plan renders as free rather than crashing", () => {
  assert.deepEqual(planPriceLabel(undefined), { amount: "Free", suffix: "" });
});

test("plans are looked up by slug", () => {
  const plans = [plan("procure", 0), plan("scale", 17400)];
  assert.equal(findPlanBySlug(plans, "scale")?.price.id, "scale-price");
  assert.equal(findPlanBySlug(plans, "operate"), undefined);
});

test("the free plan is the one the api prices at zero", () => {
  const plans = [plan("manage", 3588), plan("procure", 0), plan("scale", 9588)];

  assert.equal(findFreePlan(plans)?.slug, "procure");
  assert.equal(findFreePlan([plan("manage", 3588)]), undefined);
});

test("toList unwraps both bare arrays and paginated payloads", () => {
  assert.deepEqual(toList<number>([1, 2]), [1, 2]);
  assert.deepEqual(toList<number>({ data: [3] }), [3]);
  assert.deepEqual(toList<number>(undefined), []);
  assert.deepEqual(toList<number>({ meta: 1 }), []);
});
