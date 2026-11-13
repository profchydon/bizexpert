import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EditEmployeeLineManagerField", () => {
  it("uses design-ui Select.ComboBox with async employee search", () => {
    const field = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeLineManagerField.tsx",
      ),
      "utf8",
    );
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/useLineManagerSelectItems.ts",
      ),
      "utf8",
    );

    assert.match(field, /Select\.ComboBox/);
    assert.match(field, /label="Line Manager"/);
    assert.match(field, /onSearchChange=\{setQuery\}/);
    assert.match(field, /Avatar size="xs"/);
    assert.doesNotMatch(field, /AsyncPaginate/);
    assert.doesNotMatch(field, /react-select/);
    assert.match(hook, /useLazyGetEmployeesQuery/);
    assert.match(hook, /initials: getInitials/);
  });
});

describe("ComboBox", () => {
  it("supports async search callbacks", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/base/select/useComboBoxInput.ts"),
      "utf8",
    );

    assert.match(source, /onSearchChange\?: \(value: string\) => void/);
    assert.match(source, /onSearchChange\?\.\(value\)/);
  });
});
