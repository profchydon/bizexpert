import assert from "node:assert/strict";
import { describe, it } from "node:test";

import reducer, {
  setOffboardEmployees,
  addOffboardEmployees,
  removeOffboardEmployee,
  resetOffboardEmployees,
} from "./employeeSlice";
import type { IEmployees } from "@/types/employees";

const employee = (id: string): IEmployees =>
  ({ id, first_name: "Test", last_name: id }) as IEmployees;

describe("employeeSlice offboard reducers", () => {
  it("stores the off-board employees", () => {
    const next = reducer(
      undefined,
      setOffboardEmployees([employee("a"), employee("b")]),
    );

    assert.equal(next.offboardEmployees?.length, 2);
  });

  it("removes a single off-board employee by id", () => {
    const seeded = reducer(
      undefined,
      setOffboardEmployees([employee("a"), employee("b")]),
    );

    const next = reducer(seeded, removeOffboardEmployee("a"));

    assert.deepEqual(
      next.offboardEmployees?.map((item) => item.id),
      ["b"],
    );
  });

  it("clears the off-board employees", () => {
    const seeded = reducer(undefined, setOffboardEmployees([employee("a")]));

    const next = reducer(seeded, resetOffboardEmployees());

    assert.equal(next.offboardEmployees, undefined);
  });

  it("appends new employees without duplicating existing ones", () => {
    const seeded = reducer(undefined, setOffboardEmployees([employee("a")]));

    const next = reducer(
      seeded,
      addOffboardEmployees([employee("a"), employee("b"), employee("c")]),
    );

    assert.deepEqual(
      next.offboardEmployees?.map((item) => item.id),
      ["a", "b", "c"],
    );
  });

  it("appends to an empty batch", () => {
    const next = reducer(undefined, addOffboardEmployees([employee("a")]));

    assert.deepEqual(
      next.offboardEmployees?.map((item) => item.id),
      ["a"],
    );
  });
});
