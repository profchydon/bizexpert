import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IAsset } from "@/types/assets";
import type { IEmployees } from "@/types/employees";
import { buildEquipEmployeeFeesPayload } from "./buildEquipEmployeeFeesPayload";
import type { EquipDeviceItem, EquipReviewEmployee } from "./equipTypes";
import type { CountryOption } from "./resolveEmployeeCountryId";

const asset = (): IAsset =>
  ({
    id: "spec-1",
    asset_id: "asset-1",
    asset_spec_id: "assetspec-1",
    name: "Apple MacBook Air M3",
    asset_pricing: {
      id: "pricing-1",
      amount: "3000",
      currency: { code: "GBP", symbol: "£" },
    },
  }) as unknown as IAsset;

const marketplaceItem = (
  overrides: Partial<EquipDeviceItem> = {},
): EquipDeviceItem => ({
  lineId: "line-1",
  productId: "asset-1",
  name: "Apple MacBook Air M3",
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 3000,
  currency: "GBP",
  quantity: 2,
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
  first_name: "Ada",
  last_name: "Lovelace",
  country: "Nigeria",
  country_id: "stale-id",
} as unknown as IEmployees;

const countries: CountryOption[] = [
  { id: "ng-id", name: "Nigeria", code: "NG" },
];

describe("buildEquipEmployeeFeesPayload", () => {
  it("splits marketplace assets and storage equipment per employee", () => {
    const review: EquipReviewEmployee[] = [
      {
        id: "e1",
        name: "Ada Lovelace",
        devices: [marketplaceItem(), storageItem()],
      },
    ];

    const payload = buildEquipEmployeeFeesPayload({
      review,
      equipEmployees: [full],
      countries,
      companyCountryId: "company-country",
    });

    assert.ok(payload);
    assert.equal(payload?.country_id, "company-country");
    assert.equal(payload?.payment_method, "Credit");
    const order = payload?.orders["e1"];
    assert.equal(order?.employee_country_id, "ng-id");
    assert.deepEqual(order?.assets, [
      { asset_pricing_id: "pricing-1", quantity: 2 },
    ]);
    assert.deepEqual(order?.equipment, [
      { equipment_id: "equip-1", quantity: 1 },
    ]);
  });

  it("sends each device fulfilment date on the fee preview", () => {
    const payload = buildEquipEmployeeFeesPayload({
      review: [
        {
          id: "e1",
          name: "Ada Lovelace",
          devices: [
            marketplaceItem({ fulfilmentDate: "2026-10-23" }),
            storageItem({ fulfilmentDate: "2026-10-23" }),
          ],
        },
      ],
      equipEmployees: [full],
      countries,
      companyCountryId: "company-country",
    });

    const order = payload?.orders["e1"];
    assert.equal(order?.assets?.[0].fulfillment_date, "2026-10-23");
    assert.equal(order?.equipment?.[0].fulfillment_date, "2026-10-23");
  });

  it("falls back to the employee's own country id when unresolved", () => {
    const payload = buildEquipEmployeeFeesPayload({
      review: [{ id: "e1", name: "Ada", devices: [marketplaceItem()] }],
      equipEmployees: [full],
      countries: [],
      companyCountryId: "company-country",
    });

    assert.equal(payload?.orders["e1"].employee_country_id, "stale-id");
  });

  it("returns undefined when there is no company country or no priced devices", () => {
    assert.equal(
      buildEquipEmployeeFeesPayload({
        review: [{ id: "e1", name: "Ada", devices: [marketplaceItem()] }],
        equipEmployees: [full],
        countries,
        companyCountryId: undefined,
      }),
      undefined,
    );

    assert.equal(
      buildEquipEmployeeFeesPayload({
        review: [
          {
            id: "e1",
            name: "Ada",
            devices: [marketplaceItem({ asset: undefined })],
          },
        ],
        equipEmployees: [full],
        countries,
        companyCountryId: "company-country",
      }),
      undefined,
    );
  });
});
