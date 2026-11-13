import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyOfficeDefaultContact,
  applyRowContact,
  contactSourceFor,
  officeDefaultContact,
} from "./officeContactRules";
import type { AssignmentUnit } from "./types";
import { ICart } from "@/types/cart";

const cart = { pricing: { id: "p1" }, quantity: 1 } as ICart;

const officeUnit = (
  unitId: string,
  contactId: string,
  source?: AssignmentUnit["contactSource"],
): AssignmentUnit => ({
  unitId,
  cartItem: cart,
  contactSource: source,
  destination: {
    type: "office",
    officeId: "office-1",
    officeName: "US office 1",
    contactEmployeeId: contactId,
    contactEmployeeName: contactId,
  },
});

describe("officeContactRules", () => {
  it("treats the first non-row office contact as the shared default", () => {
    const assignments = [
      officeUnit("u1", "robert", "office-default"),
      officeUnit("u2", "robert", "office-default"),
    ];

    assert.deepEqual(officeDefaultContact(assignments, "office-1"), {
      contactEmployeeId: "robert",
      contactEmployeeName: "robert",
    });
  });

  it("moves every following row when the office default changes", () => {
    const next = applyOfficeDefaultContact(
      [
        officeUnit("u1", "robert", "office-default"),
        officeUnit("u2", "michael", "row"),
      ],
      "office-1",
      { contactEmployeeId: "ashley", contactEmployeeName: "ashley" },
    );

    assert.equal(
      next[0]?.destination.type === "office" &&
        next[0].destination.contactEmployeeId,
      "ashley",
    );
    assert.equal(
      next[1]?.destination.type === "office" &&
        next[1].destination.contactEmployeeId,
      "michael",
    );
  });

  it("clears the row override when the office default is picked again", () => {
    const next = applyRowContact(
      [officeUnit("u1", "michael", "row")],
      "u1",
      { contactEmployeeId: "jessica", contactEmployeeName: "jessica" },
      contactSourceFor("jessica", {
        contactEmployeeId: "jessica",
        contactEmployeeName: "jessica",
      }),
    );

    assert.equal(next[0]?.contactSource, "office-default");
  });
});
