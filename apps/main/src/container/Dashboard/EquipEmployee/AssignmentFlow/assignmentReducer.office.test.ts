import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ICart } from "@/types/cart";
import { reducer } from "./assignmentReducer";
import type { AssignmentState, AssignmentUnit } from "./types";

const cart = (id: string): ICart =>
  ({
    pricing: { id },
    quantity: 1,
    country: { code: "US", label: "United States" },
  }) as ICart;

const officeUnit = (unitId: string, pricingId: string): AssignmentUnit => ({
  unitId,
  cartItem: cart(pricingId),
  contactSource: "office-default",
  destination: {
    type: "office",
    officeId: "office-1",
    officeName: "US office 1",
    contactEmployeeId: "robert",
    contactEmployeeName: "Robert Garcia",
  },
});

const stateOf = (assignments: AssignmentUnit[]): AssignmentState => ({
  assignments,
  selectedIds: new Set(assignments.map((unit) => unit.unitId)),
  fulfilmentDatesByEmployee: {},
  deviceSetupsByUnit: {},
});

describe("assignmentReducer office contacts", () => {
  it("updates every following row from the shared office control", () => {
    const next = reducer(
      stateOf([officeUnit("u1", "p1"), officeUnit("u2", "p2")]),
      {
        type: "SET_OFFICE_DEFAULT_CONTACT",
        officeId: "office-1",
        contactEmployeeId: "ashley",
        contactEmployeeName: "Ashley Brown",
      },
    );

    assert.ok(
      next.assignments.every(
        (unit) =>
          unit.destination.type === "office" &&
          unit.destination.contactEmployeeId === "ashley",
      ),
    );
  });

  it("leaves a changed row alone when the office default moves", () => {
    const start = stateOf([officeUnit("u1", "p1"), officeUnit("u2", "p2")]);
    const overridden = reducer(start, {
      type: "SET_OFFICE_CONTACT",
      unitId: "u2",
      contactEmployeeId: "michael",
      contactEmployeeName: "Michael Davis",
      source: "row",
    });
    const next = reducer(overridden, {
      type: "SET_OFFICE_DEFAULT_CONTACT",
      officeId: "office-1",
      contactEmployeeId: "jessica",
      contactEmployeeName: "Jessica Williams",
    });

    assert.equal(
      next.assignments[0]?.destination.type === "office" &&
        next.assignments[0].destination.contactEmployeeId,
      "jessica",
    );
    assert.equal(
      next.assignments[1]?.destination.type === "office" &&
        next.assignments[1].destination.contactEmployeeId,
      "michael",
    );
    assert.equal(next.assignments[1]?.contactSource, "row");
  });

  it("selects every unit in a country without clearing another country", () => {
    const uk: AssignmentUnit = {
      unitId: "uk-1",
      cartItem: {
        pricing: { id: "uk" },
        quantity: 1,
        country: { code: "GB", label: "United Kingdom" },
      } as ICart,
      destination: { type: "unassigned" },
    };
    const start = {
      ...stateOf([officeUnit("us-1", "p1")]),
      selectedIds: new Set(["us-1"]),
      assignments: [officeUnit("us-1", "p1"), uk],
    };
    const next = reducer(start, {
      type: "SET_SELECTION",
      unitIds: ["us-1", "uk-1"],
    });
    assert.ok(next.selectedIds.has("us-1"));
    assert.ok(next.selectedIds.has("uk-1"));
  });

  it("sends every selected row to storage from the batch picker", () => {
    const start = stateOf([officeUnit("u1", "p1"), officeUnit("u2", "p2")]);
    const next = reducer(start, {
      type: "BATCH_ASSIGN_DESTINATION",
      destination: { type: "storage" },
    });

    assert.ok(
      next.assignments.every((unit) => unit.destination.type === "storage"),
    );
  });
});
