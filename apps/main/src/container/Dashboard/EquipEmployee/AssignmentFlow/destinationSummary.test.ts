import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  describeBlocker,
  describeDestinations,
  firstUnassignedUnitId,
  summariseUnits,
} from "./destinationSummary.ts";
import type { AssignmentUnit } from "./types.ts";

function unit(
  destination: AssignmentUnit["destination"],
  unitId = "u1",
): AssignmentUnit {
  return {
    unitId,
    destination,
    cartItem: {
      pricing: { id: "p1", amount: 100 },
      quantity: 1,
    } as AssignmentUnit["cartItem"],
  };
}

describe("destinationSummary", () => {
  it("counts people, offices, and storage separately", () => {
    const summary = summariseUnits([
      unit({ type: "employee", employeeId: "e1", employeeName: "Ada" }),
      unit(
        {
          type: "office",
          officeId: "o1",
          officeName: "HQ",
          contactEmployeeId: "c1",
          contactEmployeeName: "Ben",
        },
        "u2",
      ),
      unit({ type: "storage" }, "u3"),
      unit({ type: "unassigned" }, "u4"),
    ]);

    assert.equal(summary.people, 1);
    assert.equal(summary.offices, 1);
    assert.equal(summary.storage, 1);
    assert.equal(summary.unassigned, 1);
    assert.equal(
      describeDestinations(summary),
      "1 to a person · 1 to an office · 1 held in storage",
    );
    assert.equal(
      describeBlocker(summary),
      "1 device still needs a destination",
    );
    assert.equal(
      describeBlocker({ ...summary, unassigned: 2 }),
      "2 devices still need a destination",
    );
    assert.equal(
      describeDestinations({
        ...summary,
        people: 2,
        offices: 2,
        storage: 2,
      }),
      "2 to people · 2 to offices · 2 held in storage",
    );
    assert.equal(
      firstUnassignedUnitId([
        unit({ type: "storage" }, "u3"),
        unit({ type: "unassigned" }, "u4"),
      ]),
      "u4",
    );
  });
});
