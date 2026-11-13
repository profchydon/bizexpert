import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMPLOYEES_COLUMN_TEMPLATE,
  employeesTableShellClass,
  employeesTableTitleClass,
} from "./employeesTableClasses";

describe("employeesTableClasses", () => {
  it("matches design-ui table card shell", () => {
    assert.match(
      employeesTableShellClass,
      /rounded-xl border border-border-secondary bg-primary/,
    );
    assert.match(
      employeesTableTitleClass,
      /text-md font-semibold text-primary/,
    );
    assert.match(EMPLOYEES_COLUMN_TEMPLATE, /32px minmax\(200px,1\.5fr\)/);
  });
});
