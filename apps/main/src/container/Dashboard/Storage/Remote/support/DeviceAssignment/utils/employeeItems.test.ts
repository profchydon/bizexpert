import assert from "node:assert/strict";
import test from "node:test";
import { buildSortedEmployeeItems } from "./employeeItems";

test("buildSortedEmployeeItems keeps only the device country when fallback is off", () => {
  const employees = [
    { id: "bo-1", name: "Ana", initials: "A", country: "Bolivia" },
    { id: "uk-1", name: "Ben", initials: "B", country: "United Kingdom" },
  ] as never;

  const items = buildSortedEmployeeItems("Bolivia", employees);

  assert.deepEqual(
    items.map((item) => item.id),
    ["bo-1"],
  );
});
