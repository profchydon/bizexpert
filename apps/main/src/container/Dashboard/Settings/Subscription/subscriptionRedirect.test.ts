import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  canRetryPlanPayment,
  SUBSCRIPTION_RETURN_PATH,
  subscriptionInstancePath,
  subscriptionReturnQuery,
} from "./subscriptionRedirect";

describe("subscription redirect", () => {
  it("sends the settings path without an origin", () => {
    assert.equal(
      SUBSCRIPTION_RETURN_PATH,
      "/dashboard/settings?settingsType=subscription",
    );
    assert.equal(SUBSCRIPTION_RETURN_PATH.startsWith("/"), true);
    assert.equal(SUBSCRIPTION_RETURN_PATH.includes("http"), false);
  });

  it("keeps success and error instances on that path", () => {
    assert.equal(
      subscriptionInstancePath("success"),
      "/dashboard/settings?settingsType=subscription&success_instance=true",
    );
    assert.equal(
      subscriptionInstancePath("error"),
      "/dashboard/settings?settingsType=subscription&error_instance=true",
    );
  });

  it("reads status and tx_ref when they are appended to the instance path", () => {
    assert.deepEqual(
      subscriptionReturnQuery(
        "settingsType=subscription?status=successful&tx_ref=TX-1",
      ),
      { status: "successful", txRef: "TX-1" },
    );
    assert.deepEqual(
      subscriptionReturnQuery(
        "settingsType=subscription&status=canceled&tx_ref=TX-2",
      ),
      { status: "canceled", txRef: "TX-2" },
    );
  });

  it("keeps the transaction reference on a canceled return", () => {
    assert.equal(
      subscriptionInstancePath("error", "TX-2"),
      "/dashboard/settings?settingsType=subscription&error_instance=true&tx_ref=TX-2",
    );
    assert.equal(canRetryPlanPayment("pending_payment", "TX-2"), true);
    assert.equal(canRetryPlanPayment("pending_payment", null), false);
    assert.equal(canRetryPlanPayment("active", "TX-2"), false);
  });

  it("keeps checkout loading until the Stripe page opens", () => {
    const checkout = readFileSync(
      "src/container/Dashboard/Settings/Subscription/useSubscriptionCheckout.ts",
      "utf8",
    );
    const retry = readFileSync(
      "src/container/Dashboard/Settings/Subscription/useRetryPlanPayment.ts",
      "utf8",
    );
    assert.match(checkout, /setRedirecting\(true\)/);
    assert.match(checkout, /window\.location\.assign\(checkoutLink\)/);
    assert.match(checkout, /changeProps\.isLoading \|\| redirecting/);
    assert.match(retry, /window\.location\.assign\(link\)/);
    assert.match(retry, /props\.isLoading \|\| redirecting/);
  });
});
