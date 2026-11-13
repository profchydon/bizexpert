import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOfficeCheckoutOrders,
  checkoutDeviceSetup,
  officeRecipientKey,
  splitCheckoutRecipients,
} from "./officeCheckout";
import type { IEmployees } from "@/types/employees";

describe("officeCheckout", () => {
  it("splits office recipients into office_orders", () => {
    const office = {
      id: officeRecipientKey("office-1", "robert"),
      destination_type: "office",
      office_id: "office-1",
      contact_employee_id: "robert",
      country_id: "us-id",
      items: [{ pricing: { id: "price-1" }, quantity: 1 }],
    } as unknown as IEmployees;
    const person = { id: "emp-1", items: [] } as unknown as IEmployees;

    const { people, offices } = splitCheckoutRecipients([office, person]);
    assert.equal(offices.length, 1);
    assert.equal(people.length, 1);
    assert.deepEqual(buildOfficeCheckoutOrders([office]), [
      {
        office_id: "office-1",
        contact_employee_id: "robert",
        office_country_id: "us-id",
        assets: [{ asset_pricing_id: "price-1", quantity: 1 }],
      },
    ]);
  });

  it("copies a string device_setup onto the office asset and drops empty values", () => {
    assert.equal(checkoutDeviceSetup("ABM"), "ABM");
    assert.equal(checkoutDeviceSetup(""), undefined);
    assert.equal(checkoutDeviceSetup({}), undefined);

    const office = {
      id: officeRecipientKey("office-1", "robert"),
      destination_type: "office",
      office_id: "office-1",
      contact_employee_id: "robert",
      country_id: "us-id",
      items: [
        { pricing: { id: "price-1" }, quantity: 1, device_setup: "MI" },
        { pricing: { id: "price-2" }, quantity: 1, device_setup: {} },
      ],
    } as unknown as IEmployees;

    assert.deepEqual(buildOfficeCheckoutOrders([office])[0]?.assets, [
      { asset_pricing_id: "price-1", quantity: 1, device_setup: "MI" },
      { asset_pricing_id: "price-2", quantity: 1 },
    ]);
  });
});
