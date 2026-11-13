import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IAsset } from "@/types/assets";
import type { IEmployees } from "@/types/employees";
import { buildEquipEmployeeInitiatePayload } from "./buildEquipEmployeeInitiatePayload";
import type { EquipDeviceItem, EquipReviewEmployee } from "./equipTypes";
import type { CountryOption } from "./resolveEmployeeCountryId";

const asset = (): IAsset =>
  ({
    id: "spec-1",
    asset_id: "asset-1",
    asset_spec_id: "assetspec-1",
    name: "Apple MacBook Air M3",
    asset_pricing: { id: "pricing-1", amount: "1800" },
  }) as unknown as IAsset;

const marketplaceItem = (
  overrides: Partial<EquipDeviceItem> = {},
): EquipDeviceItem => ({
  lineId: "line-1",
  productId: "asset-1",
  name: "Apple MacBook Air M3",
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 1800,
  currency: "GBP",
  quantity: 1,
  config: "ABM",
  asset: asset(),
  ...overrides,
});

const storageItem = (
  overrides: Partial<EquipDeviceItem> = {},
): EquipDeviceItem => ({
  lineId: "equip-1",
  productId: "equip-1",
  name: "Apple MacBook Air M3",
  source: "STORAGE",
  origin: "MANUAL",
  unitPrice: 0,
  currency: "GBP",
  quantity: 1,
  config: "none",
  ...overrides,
});

const full: IEmployees = {
  id: "e1",
  country: "United Kingdom",
  country_id: "uk-id",
} as unknown as IEmployees;

const countries: CountryOption[] = [
  { id: "uk-id", name: "United Kingdom", code: "GB" },
];

const review: EquipReviewEmployee[] = [
  { id: "e1", name: "Kingdom", devices: [marketplaceItem(), storageItem()] },
];

describe("buildEquipEmployeeInitiatePayload", () => {
  it("builds a mixed initiate payload with device_setup, fulfilment date, and signature", () => {
    const payload = buildEquipEmployeeInitiatePayload({
      review: [
        {
          id: "e1",
          name: "Kingdom",
          devices: [
            marketplaceItem({ fulfilmentDate: "2026-08-01" }),
            storageItem({ fulfilmentDate: "2026-08-05", config: "MI" }),
          ],
        },
      ],
      equipEmployees: [full],
      countries,
      companyCountryId: "company-country",
      paymentMethod: "Credit",
      redirectUrl: "https://app/dashboard/transactions",
      additionalRecipients: ["it@acme.com"],
      isSignatureRequired: true,
      note: "Deliver to HQ",
    });

    assert.ok(payload);
    assert.equal(payload?.payment_method, "Credit");
    assert.equal(payload?.country_id, "company-country");
    assert.equal(payload?.redirect_url, "https://app/dashboard/transactions");
    assert.deepEqual(payload?.additional_recipients, ["it@acme.com"]);
    assert.equal(payload?.order_note, "Deliver to HQ");

    const order = payload?.orders["e1"];
    assert.equal(order?.employee_country_id, "uk-id");
    assert.deepEqual(order?.assets, [
      {
        asset_pricing_id: "pricing-1",
        quantity: 1,
        device_setup: "ABM",
        fulfillment_date: "2026-08-01",
        signature_requested: true,
        note: "Deliver to HQ",
      },
    ]);
    assert.deepEqual(order?.equipment, [
      {
        equipment_id: "equip-1",
        quantity: 1,
        device_setup: "MI",
        signature_requested: true,
        fulfillment_date: "2026-08-05",
        note: "Deliver to HQ",
      },
    ]);
  });

  it("omits device_setup for none config and signature when not required", () => {
    const payload = buildEquipEmployeeInitiatePayload({
      review: [
        {
          id: "e1",
          name: "Kingdom",
          devices: [marketplaceItem({ config: "none" }), storageItem()],
        },
      ],
      equipEmployees: [full],
      countries,
      companyCountryId: "company-country",
      paymentMethod: "Card",
      redirectUrl: "https://app/callback",
    });

    const order = payload?.orders["e1"];
    assert.deepEqual(order?.assets, [
      { asset_pricing_id: "pricing-1", quantity: 1 },
    ]);
    assert.deepEqual(order?.equipment, [
      { equipment_id: "equip-1", quantity: 1 },
    ]);
    assert.equal(payload?.additional_recipients, undefined);
    assert.equal(payload?.order_note, undefined);
  });

  it("returns undefined without company country, redirect url, or devices", () => {
    assert.equal(
      buildEquipEmployeeInitiatePayload({
        review,
        equipEmployees: [full],
        countries,
        companyCountryId: undefined,
        paymentMethod: "Credit",
        redirectUrl: "https://app/callback",
      }),
      undefined,
    );

    assert.equal(
      buildEquipEmployeeInitiatePayload({
        review,
        equipEmployees: [full],
        countries,
        companyCountryId: "company-country",
        paymentMethod: "Credit",
        redirectUrl: undefined,
      }),
      undefined,
    );
  });
});
