import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adminScopeLabel } from "./adminScopeLabel";
import type { IEmployees } from "@/types/employees";

describe("adminScopeLabel", () => {
  it("names a single office for office-scoped admins", () => {
    assert.equal(
      adminScopeLabel({
        office: { id: "office-1", name: "United States office 1" },
      } as IEmployees),
      "United States office 1",
    );
  });

  it("labels company-wide admins", () => {
    assert.equal(
      adminScopeLabel({ roles: [{ name: "Administrator" }] } as IEmployees),
      "Company-wide",
    );
  });
});
