import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { subscriptionPaymentLabel } from "./subscriptionPaymentLabel";

describe("subscription payment label", () => {
  it("uses the captured card when the billing country is absent", () => {
    assert.equal(
      subscriptionPaymentLabel({ card_brand: "visa", card_last_four: "4242" }),
      "Visa •••• 4242",
    );
  });

  it("keeps the generic copy when no card is on file", () => {
    assert.equal(
      subscriptionPaymentLabel({}),
      "This is the method used in making payment",
    );
  });
});
