import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ICart } from "@/types/cart";
import {
  resolveOnboardItemCountryId,
  shouldSkipOnboardingFeeQuery,
} from "./onboardFeePayload";

const cartItem = (item: Partial<ICart>) => item as ICart;

describe("onboard fee payload", () => {
  it("uses the cart pricing country before other country fallbacks", () => {
    assert.equal(
      resolveOnboardItemCountryId({
        countries: [{ id: "ng", code: "NG", name: "Nigeria" }],
        item: cartItem({
          asset: { country: "Nigeria" } as never,
          pricing: { country_id: "pricing-country" } as never,
        }),
        selectedCountryId: "selected-country",
      }),
      "pricing-country",
    );
  });

  it("falls back to matched country code when pricing has no country", () => {
    assert.equal(
      resolveOnboardItemCountryId({
        countries: [{ id: "ng", code: "NG", name: "Nigeria" }],
        item: {
          country: { code: "ng" },
          pricing: {},
        } as ICart & { country: { code: string } },
        selectedCountryId: "selected-country",
      }),
      "ng",
    );
  });

  it("allows fee fetching when the payload has a derived employee country", () => {
    assert.equal(
      shouldSkipOnboardingFeeQuery({
        buyToStorage: false,
        employeeCountryId: "pricing-country",
        hasPayload: true,
      }),
      false,
    );
  });

  it("skips fee fetching when no derived employee country exists", () => {
    assert.equal(
      shouldSkipOnboardingFeeQuery({
        buyToStorage: false,
        hasPayload: true,
      }),
      true,
    );
  });
});
