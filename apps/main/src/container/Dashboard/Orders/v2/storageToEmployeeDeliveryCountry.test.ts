import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IOrder } from "@/types/orders";
import { storageToEmployeeDeliveryCountries } from "./storageToEmployeeDeliveryCountry";

describe("storageToEmployeeDeliveryCountries", () => {
  it("uses delivery_info country for storage to employee", () => {
    const order = {
      type: "storage_to_employee",
      country: "Nigeria",
      country_code: "NG",
      sub_orders: [
        {
          delivery_info: {
            country: "United Kingdom",
            country_code: "GB",
          },
        },
      ],
    } as IOrder;

    assert.deepEqual(storageToEmployeeDeliveryCountries(order), [
      { name: "United Kingdom", code: "GB" },
    ]);
  });

  it("resolves a code from the country name and skips other order types", () => {
    const storage = {
      type: "storage_to_employee",
      sub_orders: [{ delivery_info: { country: "Nigeria" } }],
    } as IOrder;
    const onboarding = {
      type: "onboarding",
      sub_orders: [{ delivery_info: { country: "Nigeria" } }],
    } as IOrder;

    assert.deepEqual(storageToEmployeeDeliveryCountries(storage), [
      { name: "Nigeria", code: "NG" },
    ]);
    assert.deepEqual(storageToEmployeeDeliveryCountries(onboarding), []);
  });
});
