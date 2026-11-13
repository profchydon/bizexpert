import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEmployeeUpdatePayload,
  resolveOptionId,
} from "./employeeUpdatePayload";

describe("employee update payload", () => {
  it("resolves option labels to ids for update payload fields", () => {
    const payload = buildEmployeeUpdatePayload(
      {
        country_id: "Nigeria",
        department_id: "Engineering",
        level: "Entry",
        manager_id: "Ada Lovelace",
      },
      {
        countryOptions: [{ label: "Nigeria", value: "country-1" }],
        currentEmployee: {
          line_manager: {
            id: "manager-1",
            first_name: "Ada",
            last_name: "Lovelace",
          },
        },
        departmentOptions: [{ label: "Engineering", value: "department-1" }],
        levelOptions: [{ label: "Entry", value: "level-1" }],
      },
    );

    assert.equal(payload.country_id, "country-1");
    assert.equal(payload.department_id, "department-1");
    assert.equal(payload.department, undefined);
    assert.equal(payload.level, "level-1");
    assert.equal(payload.manager_id, "manager-1");
  });

  it("keeps ids unchanged when values are already ids", () => {
    assert.equal(
      resolveOptionId("department-1", [
        { label: "Engineering", value: "department-1" },
      ]),
      "department-1",
    );
  });

  it("falls back to current employee relationship ids", () => {
    const payload = buildEmployeeUpdatePayload(
      {
        country_id: "country-1",
        department_id: "Operations",
        level: "Senior",
        manager_id: "manager@example.com",
      },
      {
        currentEmployee: {
          departments: [{ id: "department-2", name: "Operations" }],
          level_position: { id: "level-2", name: "Senior" },
          manager: { id: "manager-2", email: "manager@example.com" },
        },
      },
    );

    assert.equal(payload.department_id, "department-2");
    assert.equal(payload.level, "level-2");
    assert.equal(payload.manager_id, "manager-2");
  });
});
