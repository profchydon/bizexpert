import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IEmployees } from "@/types/employees";
import {
  cacheSelectedEmployees,
  selectedEmployeesFromCache,
  withPinnedApprover,
} from "./ApproverSelect.utils";

const employee = (id: string, firstName: string): IEmployees =>
  ({
    id,
    first_name: firstName,
    last_name: "User",
    email: `${firstName.toLowerCase()}@example.com`,
  }) as IEmployees;

describe("ApproverSelect utils", () => {
  it("keeps selected employees cached across paginated pages", () => {
    const pageOne = [employee("1", "First")];
    const pageTwo = [employee("2", "Second")];
    const selected = ["1", "2"];

    const firstCache = cacheSelectedEmployees({
      current: {},
      employees: pageOne,
      selected,
    });
    const nextCache = cacheSelectedEmployees({
      current: firstCache,
      employees: pageTwo,
      selected,
    });

    assert.deepEqual(
      selectedEmployeesFromCache(selected, nextCache).map((item) => item.id),
      ["1", "2"],
    );
  });

  it("adds the logged-in admin as the pinned approver", () => {
    assert.deepEqual(withPinnedApprover(["employee-1"], "admin-1"), [
      "admin-1",
      "employee-1",
    ]);
    assert.deepEqual(withPinnedApprover(["admin-1"], "admin-1"), ["admin-1"]);
  });

  it("returns pinned approver details when the employee page has not loaded it", () => {
    const pinned = employee("admin-1", "Admin");
    assert.equal(
      selectedEmployeesFromCache(["admin-1"], {}, pinned)[0].email,
      "admin@example.com",
    );
  });
});
