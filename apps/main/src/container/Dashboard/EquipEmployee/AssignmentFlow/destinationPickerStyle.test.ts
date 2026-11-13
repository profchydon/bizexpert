import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { Office } from "@/container/Dashboard/Accounts/types";
import { buildDestinationOptions } from "./destinationItems";
import type { EmployeeOption } from "./types";

const dir = "src/container/Dashboard/EquipEmployee/AssignmentFlow";
const read = (file: string) =>
  readFileSync(join(process.cwd(), dir, file), "utf8");

describe("buildDestinationOptions", () => {
  const employees = [
    {
      id: "1",
      name: "Ada Obi",
      countryName: "Nigeria",
      raw: { job_title: "Designer" },
    },
    { id: "2", name: "Ben Hale", countryName: "United Kingdom", raw: {} },
  ] as unknown as EmployeeOption[];
  const offices = [
    { id: "lagos", name: "Lagos HQ", region: "Nigeria" },
    { id: "london", name: "London HQ", region: "United Kingdom" },
  ] as unknown as Office[];

  it("lists only the device country's people and offices with design-ui fields", () => {
    const options = buildDestinationOptions(
      employees,
      offices,
      "Nigeria",
      "NG",
    );

    assert.deepEqual(options.people, [
      {
        id: "emp:1",
        label: "Ada Obi",
        initials: "AO",
        supportingText: "Designer",
      },
    ]);
    assert.deepEqual(options.offices, [
      { id: "office:lagos", label: "Lagos HQ" },
    ]);
    assert.deepEqual(options.storage, {
      id: "storage",
      label: "Rayda storage",
    });
  });

  it("leaves supporting text empty when a person has no job title", () => {
    const options = buildDestinationOptions(
      employees,
      offices,
      "United Kingdom",
      "GB",
    );

    assert.equal(options.people[0].supportingText, undefined);
  });
});

describe("assign dropdowns use the design-ui select", () => {
  it("builds every assign picker on the Untitled select, not the command popover", () => {
    for (const file of [
      "DestinationPicker.tsx",
      "OfficeContactPicker.tsx",
      "SetupPicker.tsx",
    ]) {
      const source = read(file);
      assert.match(source, /@\/components\/base\/select\/select/);
      assert.doesNotMatch(source, /@\/components\/ui\/command/);
    }
  });

  it("groups destinations into People, Offices, and Hold in stock", () => {
    const picker = read("DestinationPicker.tsx");

    assert.match(picker, /<Select\.ComboBox/);
    assert.match(picker, /header="People"/);
    assert.match(picker, /header="Offices"/);
    assert.match(picker, /header="Hold in stock"/);
    assert.match(picker, /popoverClassName="min-w-\[400px\]"/);
  });

  it("drops the old Autocomplete from the row and batch bar", () => {
    assert.doesNotMatch(read("DeviceRow.tsx"), /Autocomplete/);
    assert.doesNotMatch(read("BatchActionBar.tsx"), /Autocomplete/);
    assert.match(read("DeviceRow.tsx"), /<SetupPicker/);
  });
});
