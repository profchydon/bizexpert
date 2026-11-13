import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const GET_EMPLOYEES =
  "src/api/baseQueries/companiesApi/employeesApi/getEmployees.ts";

const OFFICE_MEMBERS =
  "src/container/Dashboard/Accounts/Offices/hooks/useOfficeMembersServer.ts";

describe("EmployeeListQueryParams", () => {
  it("declares office_id so office-scoped member lists type-check", () => {
    assert.match(read(GET_EMPLOYEES), /office_id\?: string;/);
  });

  it("keeps the country and pagination params the assignment flow sends", () => {
    const source = read(GET_EMPLOYEES);

    assert.match(source, /country_id\?: string;/);
    assert.match(source, /country_code\?: string;/);
    assert.match(source, /paginate\?: boolean;/);
  });
});

describe("office members employee query", () => {
  it("scopes the employees request to the office", () => {
    assert.match(
      read(OFFICE_MEMBERS),
      /params: \{ office_id: officeId, page, per_page: MEMBERS_PER_PAGE \}/,
    );
  });
});
