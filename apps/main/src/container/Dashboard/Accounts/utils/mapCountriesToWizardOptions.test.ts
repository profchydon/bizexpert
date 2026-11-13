import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapCountriesToWizardOptions } from "./mapCountriesToWizardOptions";

describe("mapCountriesToWizardOptions", () => {
  it("maps API countries to sorted wizard options with ISO codes", () => {
    const options = mapCountriesToWizardOptions([
      {
        id: "2",
        name: "United Kingdom",
        code: "GB",
        currency_code: "GBP",
        currency_symbol: "£",
        payment_processor: "stripe",
        status: "active",
        created_at: "",
        updated_at: "",
        currency_id: "gbp",
      },
      {
        id: "1",
        name: "United States",
        code: "US",
        currency_code: "USD",
        currency_symbol: "$",
        payment_processor: "stripe",
        status: "active",
        created_at: "",
        updated_at: "",
        currency_id: "usd",
      },
    ]);

    assert.deepEqual(options, [
      { value: "United Kingdom", label: "United Kingdom", code: "GB" },
      { value: "United States", label: "United States", code: "US" },
    ]);
  });

  it("returns an empty list when countries are missing or incomplete", () => {
    assert.deepEqual(mapCountriesToWizardOptions(undefined), []);
    assert.deepEqual(
      mapCountriesToWizardOptions([
        {
          id: "1",
          name: "",
          code: "US",
          currency_code: "USD",
          currency_symbol: "$",
          payment_processor: "stripe",
          status: "active",
          created_at: "",
          updated_at: "",
          currency_id: "usd",
        },
      ]),
      [],
    );
  });
});
