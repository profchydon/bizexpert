import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import type { ICompany } from "@/types/auth";
import {
  applyWorkspaceCountryDefault,
  buildWorkspaceCurrencyItems,
  buildWorkspaceOverrideHint,
  hasWorkspaceOverride,
  resolveCompanyEquipmentDefaults,
  resolveCurrencyIdForCode,
  resolveEntityEquipmentDefaults,
} from "./workspaceEquipmentDefaults.ts";

const entity = (fields: Partial<EntityApiRecord>) =>
  ({
    id: "entity-1",
    name: "Intensa Nigeria",
    billing_responsibility: "self",
    ...fields,
  }) as EntityApiRecord;

describe("resolveEntityEquipmentDefaults", () => {
  it("reads a plain country name and the billing currency", () => {
    assert.deepEqual(
      resolveEntityEquipmentDefaults(
        entity({ country: "Nigeria", billing_currency: "USD" }),
      ),
      { countryName: "Nigeria", currencyCode: "USD" },
    );
  });

  it("reads a country object", () => {
    assert.deepEqual(
      resolveEntityEquipmentDefaults(
        entity({
          country: { id: "ng", name: "Nigeria", code: "NG" },
          billing_currency: "gbp",
        }),
      ),
      { countryName: "Nigeria", currencyCode: "GBP" },
    );
  });

  it("prefers the delegated payer currency when billing is delegated", () => {
    assert.equal(
      resolveEntityEquipmentDefaults(
        entity({
          country: "Nigeria",
          billing_currency: "NGN",
          billing_responsibility: "delegated",
          delegated_payer: {
            id: "p1",
            name: "Parent",
            billing_currency: "GBP",
          },
        }),
      ).currencyCode,
      "GBP",
    );
  });

  it("returns empty defaults when the entity has not loaded", () => {
    assert.deepEqual(resolveEntityEquipmentDefaults(undefined), {
      countryName: "",
      currencyCode: "",
    });
  });
});

describe("resolveCompanyEquipmentDefaults", () => {
  it("uses billing currency and ignores the country currency", () => {
    assert.deepEqual(
      resolveCompanyEquipmentDefaults({
        billing_currency: "USD",
        country: { name: "Netherlands", currency_code: "EUR" },
      } as ICompany),
      { countryName: "Netherlands", currencyCode: "USD" },
    );
  });

  it("uses billing_currency_code when billing_currency is missing", () => {
    assert.deepEqual(
      resolveCompanyEquipmentDefaults({
        billing_currency_code: "GBP",
        country: { name: "United Kingdom", currency_code: "EUR" },
      } as ICompany),
      { countryName: "United Kingdom", currencyCode: "GBP" },
    );
  });

  it("returns empty defaults with no company", () => {
    assert.deepEqual(resolveCompanyEquipmentDefaults(undefined), {
      countryName: "",
      currencyCode: "",
    });
  });
});

describe("resolveCurrencyIdForCode", () => {
  const currencies = [
    { id: "usd-id", code: "USD" },
    { id: "gbp-id", code: "GBP" },
  ];

  it("matches a code regardless of casing", () => {
    assert.equal(resolveCurrencyIdForCode(currencies, "gbp"), "gbp-id");
  });

  it("returns empty for an unknown or missing code", () => {
    assert.equal(resolveCurrencyIdForCode(currencies, "KES"), "");
    assert.equal(resolveCurrencyIdForCode(currencies, ""), "");
    assert.equal(resolveCurrencyIdForCode(undefined, "USD"), "");
  });
});

describe("buildWorkspaceCurrencyItems", () => {
  it("offers exactly the workspace currency", () => {
    assert.deepEqual(buildWorkspaceCurrencyItems("gbp-id", "GBP"), [
      { id: "gbp-id", label: "GBP" },
    ]);
  });

  it("offers nothing until the currency resolves", () => {
    assert.deepEqual(buildWorkspaceCurrencyItems("", "GBP"), []);
    assert.deepEqual(buildWorkspaceCurrencyItems("gbp-id", ""), []);
  });
});

describe("applyWorkspaceCountryDefault", () => {
  it("fills an empty country from the workspace", () => {
    assert.equal(
      applyWorkspaceCountryDefault("", "United Kingdom"),
      "United Kingdom",
    );
  });

  it("keeps a country the user already chose", () => {
    assert.equal(
      applyWorkspaceCountryDefault("Nigeria", "United Kingdom"),
      "Nigeria",
    );
  });
});

describe("hasWorkspaceOverride", () => {
  it("flags a saved value that differs from the workspace value", () => {
    assert.equal(hasWorkspaceOverride("Germany", "United Kingdom"), true);
  });

  it("does not flag a match, or a missing value on either side", () => {
    assert.equal(hasWorkspaceOverride("Nigeria", "Nigeria"), false);
    assert.equal(hasWorkspaceOverride("", "Nigeria"), false);
    assert.equal(hasWorkspaceOverride("Nigeria", ""), false);
    assert.equal(hasWorkspaceOverride(undefined, undefined), false);
  });
});

describe("buildWorkspaceOverrideHint", () => {
  it("names the saved value so the rewrite is not silent", () => {
    assert.equal(
      buildWorkspaceOverrideHint("country", "Germany"),
      "Saved as Germany. Saving updates it to the workspace country.",
    );
  });
});
