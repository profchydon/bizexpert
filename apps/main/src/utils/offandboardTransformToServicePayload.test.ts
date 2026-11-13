import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { offandboardTransformToServicePayload } from "./offandboardTransformToServicePayload";

const assigneeId = "019f43a3-dcc6-738a-9ff2-0ce1026b14c3";
const offboardEquipmentId = "9fb7c50a-fe57-403d-9924-d1786a5c8bfb";
const storageEquipmentId = "storage-device-uuid";

const groupedFromStorage = [
  {
    actionType: "Store",
    assignee: { id: assigneeId, country_id: "employee-country-id" },
    assets: [
      {
        id: offboardEquipmentId,
        flowType: "offboarding" as const,
        collectionDate: "2026-07-28T23:00:00.000Z",
        actionType: "Store",
        storageDuration: "3",
      },
      {
        id: storageEquipmentId,
        flowType: "onboarding" as const,
      },
    ],
    collectionDate: "2026-07-28T23:00:00.000Z",
  },
];

describe("offandboardTransformToServicePayload (from_storage)", () => {
  it("builds offboarding equipment and onboarding_from_storage equipment", () => {
    const payload = offandboardTransformToServicePayload({
      groupedData: groupedFromStorage,
      payment_method: "Card",
      flowSource: "from_storage",
      countryId: "employee-country-id",
      companyCountryId: "company-country-id",
      isDeviceRefreshFlow: true,
      isSignatureRequired: false,
    });

    assert.deepEqual(payload.offboarding?.orders[assigneeId]?.equipment, [
      {
        equipment_id: offboardEquipmentId,
        quantity: 1,
        collection_date: "2026-07-28T23:00:00.000Z",
        storage: true,
        duration: "3",
      },
    ]);

    assert.deepEqual(
      payload.onboarding_from_storage?.orders[assigneeId]?.equipment,
      [
        {
          equipment_id: storageEquipmentId,
          quantity: 1,
          signature_requested: false,
        },
      ],
    );
    assert.equal(
      payload.onboarding_from_storage?.orders[assigneeId]?.assets,
      undefined,
    );
    assert.equal(payload.onboarding, undefined);
    assert.equal(
      payload.onboarding_from_storage?.employee_country_id,
      undefined,
    );
  });

  it("uses onboarding with assets for marketplace onboarding", () => {
    const payload = offandboardTransformToServicePayload({
      groupedData: [
        {
          actionType: "Dispose",
          assignee: { id: assigneeId, country_id: "employee-country-id" },
          assets: [
            {
              id: offboardEquipmentId,
              flowType: "offboarding" as const,
              collectionDate: "2026-07-28T23:00:00.000Z",
              actionType: "Dispose",
            },
            {
              flowType: "onboarding" as const,
              pricing: { id: "pricing-id" },
              fulfillment_date: "2026-08-01",
            },
          ],
          collectionDate: "2026-07-28T23:00:00.000Z",
        },
      ],
      payment_method: "Card",
      flowSource: "from_marketplace",
      countryId: "employee-country-id",
      companyCountryId: "company-country-id",
      isDeviceRefreshFlow: true,
      isSignatureRequired: true,
    });

    assert.deepEqual(payload.onboarding?.orders[assigneeId]?.assets, [
      {
        asset_pricing_id: "pricing-id",
        employee_id: assigneeId,
        quantity: 1,
        fulfillment_date: "2026-08-01",
        note: undefined,
        signature_requested: true,
      },
    ]);
    assert.equal(
      payload.onboarding?.employee_country_id,
      "employee-country-id",
    );
    assert.equal(payload.onboarding_from_storage, undefined);
  });
});
