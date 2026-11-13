import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ICart } from "@/types/cart";
import { buildInitialState, reducer } from "./assignmentReducer";

const cartItem = (id: string, quantity: number) =>
  ({
    pricing: { id },
    quantity,
    country: { code: "NG", label: "Nigeria" },
  }) as unknown as ICart;

const assignAll = () => {
  let state = buildInitialState([cartItem("p", 3)]);
  ["Ada", "Bola", "Chidi"].forEach((name, index) => {
    state = reducer(state, {
      type: "ASSIGN_DESTINATION",
      unitId: `p-${index}`,
      destination: { type: "employee", employeeId: name, employeeName: name },
    });
  });
  return state;
};

const names = (state: ReturnType<typeof buildInitialState>) =>
  state.assignments.map((unit) =>
    unit.destination.type === "employee" ? unit.destination.employeeName : "",
  );

describe("assignment reducer remove unit", () => {
  it("removes only that row and drops it from the selection", () => {
    let state = assignAll();
    state = reducer(state, { type: "SET_SELECTION", unitIds: ["p-1", "p-2"] });
    state = reducer(state, { type: "REMOVE_UNIT", unitId: "p-1" });

    assert.deepEqual(names(state), ["Ada", "Chidi"]);
    assert.deepEqual([...state.selectedIds], ["p-2"]);
  });

  it("keeps every other answer when the cart reloads with the lower quantity", () => {
    let state = assignAll();
    state = reducer(state, {
      type: "SET_UNIT_DEVICE_SETUP",
      unitId: "p-2",
      deviceSetup: "ABM",
    });
    state = reducer(state, { type: "REMOVE_UNIT", unitId: "p-1" });
    state = reducer(state, {
      type: "RESET_FROM_CART",
      items: [cartItem("p", 2)],
    });

    assert.deepEqual(
      state.assignments.map((unit) => unit.unitId),
      ["p-0", "p-1"],
    );
    assert.deepEqual(names(state), ["Ada", "Chidi"]);
    assert.deepEqual(state.deviceSetupsByUnit, { "p-1": "ABM" });
  });

  it("adds new units unassigned when the cart grows", () => {
    let state = assignAll();
    state = reducer(state, {
      type: "RESET_FROM_CART",
      items: [cartItem("p", 4)],
    });

    assert.deepEqual(names(state), ["Ada", "Bola", "Chidi", ""]);
    assert.equal(state.assignments[3].destination.type, "unassigned");
  });
});
