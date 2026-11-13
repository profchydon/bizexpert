import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactElement } from "react";
import type { IEmployees } from "@/types/employees";
import { buildPrimaryProfileFields } from "./employeeProfileFields.tsx";

const employee = (fields: Partial<IEmployees>) => fields as IEmployees;

const labels = (list: { label: string }[]) => list.map((field) => field.label);

describe("employee profile Office field", () => {
  it("sits directly under Location on the profile rail", () => {
    const fields = buildPrimaryProfileFields(
      employee({ office: { id: "office-1", name: "Lagos Office" } }),
    );

    assert.deepEqual(labels(fields), [
      "Line Manager",
      "Location",
      "Office",
      "Role",
      "Department",
      "Employee type",
      "Employee level",
    ]);
  });

  it("shows the plain office name when no href has resolved yet", () => {
    const fields = buildPrimaryProfileFields(
      employee({
        office: { id: "019fee85", name: "Integration Test Office Renamed" },
      }),
    );

    const office = fields.find((field) => field.label === "Office");
    assert.equal(office?.value, "Integration Test Office Renamed");
  });

  it("links the office to its detail page carrying the entityId param", () => {
    const href = "/dashboard/accounts/offices/019fee85?entityId=entity-1";
    const fields = buildPrimaryProfileFields(
      employee({
        office: { id: "019fee85", name: "Integration Test Office Renamed" },
      }),
      href,
    );

    const office = fields.find((field) => field.label === "Office")
      ?.value as ReactElement<{ href: string; children: string }>;

    assert.equal(office.props.href, href);
    assert.equal(office.props.children, "Integration Test Office Renamed");
  });

  it("stays plain text when there is a href but no office name", () => {
    assert.equal(
      buildPrimaryProfileFields(
        employee({ office: null }),
        "/dashboard/accounts/offices/019fee85?entityId=entity-1",
      ).find((field) => field.label === "Office")?.value,
      "—",
    );
  });

  it("renders a nested country object as the location name", () => {
    assert.equal(
      buildPrimaryProfileFields(
        employee({ country: { name: "Nigeria" } as never }),
      ).find((field) => field.label === "Location")?.value,
      "Nigeria",
    );
  });

  it("falls back to the shared em dash when the employee has no office", () => {
    assert.equal(
      buildPrimaryProfileFields(employee({ office: null })).find(
        (field) => field.label === "Office",
      )?.value,
      "—",
    );
    assert.equal(
      buildPrimaryProfileFields(employee({})).find(
        (field) => field.label === "Office",
      )?.value,
      "—",
    );
  });

  it("treats a blank office name as missing", () => {
    assert.equal(
      buildPrimaryProfileFields(
        employee({ office: { id: "office-1", name: "   " } }),
      ).find((field) => field.label === "Office")?.value,
      "—",
    );
  });
});

describe("employee profile rail office href", () => {
  const rail = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Employees/EmployeeDetails/EmployeeProfileRail.tsx",
    ),
    "utf8",
  );

  it("resolves the href from the employee's office id", () => {
    assert.match(rail, /useOfficeDetailHref\(/);
    assert.match(rail, /employee\?\.office_id \?\? employee\?\.office\?\.id/);
    assert.match(rail, /buildPrimaryProfileFields\(employee, officeHref\)/);
  });

  it("uses the shared lookup rather than the equipment-named wrapper", () => {
    assert.match(rail, /from "@\/hooks\/useOfficeDetailHref"/);
    assert.doesNotMatch(rail, /useEquipmentOfficeHref/);
  });
});
