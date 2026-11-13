import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ICart } from "@/types/cart";
import { IEmployees } from "@/types/employees";
import { AssignmentUnit } from "./types";
import { groupByEmployee } from "./utils";

const employee = {
  id: "emp-a",
  first_name: "Person",
  last_name: "A",
} as IEmployees;

const employeeOption = {
  id: "emp-a",
  name: "Person A",
  raw: employee,
};

const cartItem = (pricingId: string): ICart =>
  ({
    pricing: { id: pricingId },
    quantity: 1,
  }) as ICart;

const employeeUnit = (unitId: string, pricingId: string): AssignmentUnit => ({
  unitId,
  cartItem: cartItem(pricingId),
  destination: {
    type: "employee",
    employeeId: "emp-a",
    employeeName: "Person A",
  },
});

describe("groupByEmployee device setup", () => {
  it("keeps different config requests on separate lines for the same employee", () => {
    const units = [
      employeeUnit("pricing-1-0", "pricing-1"),
      employeeUnit("pricing-2-0", "pricing-2"),
    ];

    const grouped = groupByEmployee(
      units,
      [employeeOption],
      {},
      {
        "pricing-1-0": "ABM",
        "pricing-2-0": "MI",
      },
    );

    assert.equal(grouped.length, 1);
    assert.equal(grouped[0]?.items.length, 2);
    assert.equal(grouped[0]?.items[0]?.device_setup, "ABM");
    assert.equal(grouped[0]?.items[1]?.device_setup, "MI");
  });

  it("merges identical pricing and config into one cart line", () => {
    const units = [
      employeeUnit("pricing-1-0", "pricing-1"),
      employeeUnit("pricing-1-1", "pricing-1"),
    ];

    const grouped = groupByEmployee(
      units,
      [employeeOption],
      {},
      {
        "pricing-1-0": "ABM",
        "pricing-1-1": "ABM",
      },
    );

    assert.equal(grouped[0]?.items.length, 1);
    assert.equal(grouped[0]?.items[0]?.quantity, 2);
    assert.equal(grouped[0]?.items[0]?.device_setup, "ABM");
  });

  it("splits two office receivers into two checkout groups", () => {
    const units: AssignmentUnit[] = [
      {
        unitId: "u1",
        cartItem: cartItem("p1"),
        destination: {
          type: "office",
          officeId: "office-1",
          officeName: "US office 1",
          contactEmployeeId: "robert",
          contactEmployeeName: "Robert Garcia",
        },
      },
      {
        unitId: "u2",
        cartItem: cartItem("p2"),
        destination: {
          type: "office",
          officeId: "office-1",
          officeName: "US office 1",
          contactEmployeeId: "ashley",
          contactEmployeeName: "Ashley Brown",
        },
      },
    ];

    const grouped = groupByEmployee(units, [], {}, {}, [
      {
        id: "office-1",
        name: "US office 1",
        address: "1 Market St",
        region: "United States",
        countryId: "us-id",
      },
    ]);

    assert.equal(grouped.length, 2);
    assert.equal(grouped[0]?.office_id, "office-1");
    assert.equal(grouped[0]?.contact_employee_id, "robert");
    assert.equal(grouped[1]?.contact_employee_id, "ashley");
  });
});
