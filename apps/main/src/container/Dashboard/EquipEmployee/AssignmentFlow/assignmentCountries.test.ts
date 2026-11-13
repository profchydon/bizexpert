import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAssignmentCountries,
  buildAssignmentCountriesKey,
} from "./assignmentCountries";
import { ICart } from "@/types/cart";

describe("buildAssignmentCountries", () => {
  it("dedupes cart countries and attaches fallback country id", () => {
    const carts = [
      {
        pricing: { id: "pricing-1" },
        country: { code: "ng", name: "Nigeria", label: "Nigeria" },
      },
      {
        pricing: { id: "pricing-2" },
        country: { code: "NG", name: "Nigeria", label: "Nigeria" },
      },
    ] as ICart[];

    const countries = buildAssignmentCountries(carts, {
      id: "country-uuid",
      code: "NG",
      name: "Nigeria",
    });

    assert.equal(countries.length, 1);
    assert.equal(countries[0]?.code, "NG");
    assert.equal(countries[0]?.countryId, "country-uuid");
  });

  it("returns the same countries key for equivalent cart arrays", () => {
    const fallback = {
      id: "country-uuid",
      code: "NG",
      name: "Nigeria",
    };
    const first = [
      {
        pricing: { id: "pricing-1" },
        country: { code: "ng", name: "Nigeria", label: "Nigeria" },
      },
    ] as ICart[];
    const second = [
      {
        pricing: { id: "pricing-1" },
        country: { code: "ng", name: "Nigeria", label: "Nigeria" },
      },
    ] as ICart[];

    assert.equal(
      buildAssignmentCountriesKey(first, fallback),
      buildAssignmentCountriesKey(second, fallback),
    );
    assert.notEqual(first, second);
  });
});
