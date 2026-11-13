import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  readSubscriberSaving,
  SUBSCRIPTION_SETTINGS_HREF,
  subscriberSavingCopy,
} from "./subscriberSaving";

describe("subscriberSaving", () => {
  it("hides a missing or zero saving", () => {
    assert.equal(readSubscriberSaving(undefined), null);
    assert.equal(readSubscriberSaving({}), null);
    assert.equal(readSubscriberSaving({ savings: { amount: 0 } }), null);
    assert.equal(readSubscriberSaving({ savings: { amount: -4 } }), null);
  });

  it("accepts a fee summary whose savings amount is optional", () => {
    const feeSummary: { savings?: { amount?: number } } = {
      savings: { amount: 20 },
    };
    assert.equal(readSubscriberSaving(feeSummary)?.amount, 20);
    assert.equal(readSubscriberSaving({ savings: {} }), null);
  });

  it("reads a positive saving and subscribed flag", () => {
    const saving = readSubscriberSaving({
      savings: {
        amount: 40,
        currency: "USD",
        is_subscribed: true,
        basis: "entry_paid_plan",
      },
    });

    assert.deepEqual(saving, {
      amount: 40,
      currency: "USD",
      is_subscribed: true,
      basis: "entry_paid_plan",
    });
  });

  it("uses Preferred Pricing verbs and the live Subscription settings tab", () => {
    assert.equal(subscriberSavingCopy(false), "Save about");
    assert.equal(subscriberSavingCopy(true), "You saved");
    assert.equal(
      SUBSCRIPTION_SETTINGS_HREF,
      "/dashboard/settings?settingsType=subscription",
    );
  });
});
