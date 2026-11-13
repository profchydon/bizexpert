import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  filterAdminOptionsByCountry,
  toOfficeAdminOption,
  type OfficeAdminOption,
} from "./mapAdminOption.ts";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const OFFICES = "src/container/Dashboard/Accounts/Offices";

const option = (fields: Partial<OfficeAdminOption>): OfficeAdminOption => ({
  value: "user-1",
  label: "Tunji Ade",
  ...fields,
});

describe("filterAdminOptionsByCountry", () => {
  const uk = option({ country: "United Kingdom", countryCode: "GB" });
  const ng = option({
    value: "user-2",
    label: "Bimpe Jacobs",
    country: "Nigeria",
    countryCode: "NG",
  });

  it("keeps only admins in the entity's country", () => {
    assert.deepEqual(filterAdminOptionsByCountry([uk, ng], "United Kingdom"), [
      uk,
    ]);
  });

  it("matches on country code too", () => {
    assert.deepEqual(filterAdminOptionsByCountry([uk, ng], "NG"), [ng]);
  });

  it("ignores casing and surrounding whitespace", () => {
    assert.deepEqual(
      filterAdminOptionsByCountry([uk, ng], "  united kingdom  "),
      [uk],
    );
  });

  it("returns nothing when no entity is selected", () => {
    assert.deepEqual(filterAdminOptionsByCountry([uk, ng], null), []);
    assert.deepEqual(filterAdminOptionsByCountry([uk, ng], "   "), []);
  });

  it("drops admins whose country is missing entirely", () => {
    const unknown = option({ value: "user-3", country: undefined });
    assert.deepEqual(filterAdminOptionsByCountry([unknown], "Nigeria"), []);
  });

  it("reads the country off the real users payload shape", () => {
    const mapped = toOfficeAdminOption({
      id: "user-9",
      first_name: "Tunji",
      last_name: "Ade",
      country: { name: "United Kingdom", code: "GB" },
    });

    assert.equal(mapped.country, "United Kingdom");
    assert.equal(mapped.countryCode, "GB");
    assert.deepEqual(filterAdminOptionsByCountry([mapped], "GB"), [mapped]);
  });

  it("reads employee country as a string plus country_code", () => {
    const mapped = toOfficeAdminOption({
      id: "user-10",
      first_name: "Giulia",
      last_name: "Rossi",
      country: "Italy",
      country_code: "IT",
    });

    assert.equal(mapped.country, "Italy");
    assert.equal(mapped.countryCode, "IT");
    assert.deepEqual(filterAdminOptionsByCountry([mapped], "Italy"), [mapped]);
  });
});

describe("office admin directory country scope", () => {
  const hook = read(`${OFFICES}/hooks/useOfficeAdminOptions.ts`);

  it("does not query at all until an entity is picked", () => {
    assert.match(
      hook,
      /const requiresCountry = filterByCountry && !normalizedCountry/,
    );
    assert.match(hook, /skip: skip \|\| !companyId \|\| requiresCountry/);
    assert.match(hook, /options: requiresCountry \? \[\] : options/);
    assert.match(hook, /filterByCountry = config\?\.filterByCountry \?\? true/);
  });

  it("loads company users for admin_user_ids instead of employee records", () => {
    assert.match(hook, /useGetCompanyUsersQuery/);
    assert.match(hook, /search: search \|\| undefined/);
    assert.doesNotMatch(hook, /useGetEmployeesQuery/);
    assert.doesNotMatch(hook, /country_code: countryCode/);
  });

  it("still filters client side, since search also matches names", () => {
    assert.match(hook, /applyAdminCountryScope\(/);
  });

  it("restarts when the entity's country or company changes", () => {
    assert.match(hook, /\}, \[search, normalizedCountry, companyId\]\)/);
    assert.match(hook, /setPage\(1\);\s*\n\s*setOptions\(\[\]\);/);
  });
});

describe("create office wizard admin scoping", () => {
  const wizard = read(`${OFFICES}/wizard/CreateOfficeWizard.tsx`);
  const step = read(`${OFFICES}/wizard/StepOfficeDetails.tsx`);

  it("scopes the directory to the selected entity's employees", () => {
    assert.match(
      wizard,
      /useOfficeAdminOptions\(!isOpen, parent\?\.region, \{\s*companyId: parent\?\.id,\s*\}\)/,
    );
    assert.doesNotMatch(wizard, /filterByCountry:\s*false/);
  });

  it("clears chosen admins when the entity changes", () => {
    assert.match(step, /update\(\{ parentId: value, adminNames: \[\] \}\)/);
  });

  it("treats every entity the same, with no primary-company special case", () => {
    assert.doesNotMatch(step, /primaryEntityId/);
    assert.doesNotMatch(step, /lockedAdmin/);
    assert.match(step, /options=\{admins\.options\}/);
  });

  it("explains which country the admins come from", () => {
    assert.match(step, /admins\.requiresCountry/);
    assert.match(step, /Select a parent entity to see admins in its country\./);
    assert.match(step, /Showing employees in \$\{parent\?\.region\}/);
  });
});

describe("edit office modal admin scoping", () => {
  const edit = read(`${OFFICES}/detail/components/EditOfficeModal.tsx`);

  it("scopes the directory to the office entity employees", () => {
    assert.match(
      edit,
      /useOfficeAdminOptions\(!isOpen, office\?\.region, \{\s*companyId: office\?\.subsidiaryId,\s*\}\)/,
    );
    assert.doesNotMatch(edit, /useOfficeAdminOptions\(!isOpen\)/);
  });
});
