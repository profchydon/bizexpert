import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  cardProcessorLabel,
  mapEntityPaymentProcessor,
  replaceCardCopy,
} from "./replaceCardCopy";

describe("replaceCardCopy", () => {
  it("matches the replace-card dialog when a card is already saved", () => {
    const copy = replaceCardCopy(true, "Acme Inc", "Airwallex");

    assert.equal(copy.title, "Replace card");
    assert.match(copy.description, /Add a new card for Acme Inc on Airwallex/);
    assert.match(copy.description, /billing carries on without a break/);
    assert.equal(copy.status, "A card is saved for this entity.");
    assert.equal(copy.confirm, "Continue to Airwallex");
    assert.match(copy.secure, /Rayda never stores your card number/);
  });

  it("switches the title and status when no card is on file", () => {
    const copy = replaceCardCopy(false, "Rayda Step", "Stripe");

    assert.equal(copy.title, "Add card");
    assert.match(copy.description, /can't bill until its card is captured/);
    assert.equal(copy.status, "No card captured yet.");
    assert.equal(copy.confirm, "Continue to Stripe");
  });
});

describe("cardProcessorLabel", () => {
  it("uses Airwallex when the entity has no processor", () => {
    assert.equal(cardProcessorLabel(null), "Airwallex");
    assert.equal(mapEntityPaymentProcessor("Nigeria"), null);
  });

  it("reads the processor from a country object", () => {
    assert.equal(
      cardProcessorLabel(
        mapEntityPaymentProcessor({
          id: "us",
          name: "United States",
          code: "US",
          payment_processor: "Stripe",
        }),
      ),
      "Stripe",
    );
  });
});
