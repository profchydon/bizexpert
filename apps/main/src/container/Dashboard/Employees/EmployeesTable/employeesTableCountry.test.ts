import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { IEmployees } from "@/types/employees";
import { filterEmployeesBySearch } from "./filterEmployeesBySearch";

const tableDir = join(
  process.cwd(),
  "src/container/Dashboard/Employees/EmployeesTable",
);

const nestedCountry = {
  id: "ng",
  name: "Nigeria",
  code: "NG",
  currency_code: "NGN",
  payment_processor: "paystack",
};

describe("employees table nested country", () => {
  it("resolves country objects before render, search, and equip", () => {
    const row = readFileSync(join(tableDir, "EmployeesTableRow.tsx"), "utf8");
    const index = readFileSync(join(tableDir, "index.tsx"), "utf8");
    const equip = readFileSync(join(tableDir, "useEquipEmployees.ts"), "utf8");
    const data = readFileSync(
      join(tableDir, "filterEmployeesBySearch.ts"),
      "utf8",
    );
    const strip = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/OffboardDevices/EmployeeSwitcherStrip.tsx",
      ),
      "utf8",
    );
    const storageSelect = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/SelectEmployees/EmployeesTable/tableColumn.tsx",
      ),
      "utf8",
    );

    assert.match(row, /resolveCountryText\(employee\.country\)/);
    assert.match(row, /resolveCountryCode\(/);
    assert.doesNotMatch(row, /\{employee\.country \?\? ""\}/);
    assert.match(index, /resolveCountryText\(employee\.country\)/);
    assert.match(equip, /!resolveCountryText\(employee\.country\)/);
    assert.match(data, /resolveCountryText\(employee\.country\)/);
    assert.match(strip, /country: resolveCountryText\(employee\.country\)/);
    assert.match(
      storageSelect,
      /resolveCountryText\(row\?\.original\?\.country\)/,
    );
  });

  it("searches employees by nested country name", () => {
    const employees = [
      {
        first_name: "Ada",
        last_name: "Obi",
        email: "ada@example.com",
        country: nestedCountry,
        job_title: "Engineer",
      },
      {
        first_name: "Bo",
        last_name: "Li",
        email: "bo@example.com",
        country: "Ghana",
        job_title: "PM",
      },
    ] as IEmployees[];

    assert.equal(filterEmployeesBySearch(employees, "nigeria").length, 1);
    assert.equal(filterEmployeesBySearch(employees, "ghana").length, 1);
    assert.equal(filterEmployeesBySearch(employees, "ada").length, 1);
  });
});
