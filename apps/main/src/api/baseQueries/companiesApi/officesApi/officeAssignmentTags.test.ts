import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { officeAssignmentTags } from "./officeAssignmentTags";

const dir = dirname(fileURLToPath(import.meta.url));
const endpointSource = readFileSync(
  join(dir, "assignOfficeMembers.ts"),
  "utf8",
);
const bulkActionsSource = readFileSync(
  join(
    dir,
    "../../../../container/Dashboard/Accounts/Offices/hooks/useOfficeBulkActions.ts",
  ),
  "utf8",
);

describe("officeAssignmentTags", () => {
  it("invalidates the destination office detail and the member list", () => {
    assert.deepEqual(officeAssignmentTags("Equipment", "dest"), [
      "Offices",
      "Equipment",
      { type: "Office", id: "dest" },
    ]);
  });

  it("also invalidates the source office so its area counts refetch", () => {
    assert.deepEqual(officeAssignmentTags("Equipment", "dest", "src"), [
      "Offices",
      "Equipment",
      { type: "Office", id: "dest" },
      { type: "Office", id: "src" },
    ]);
  });

  it("does not duplicate the tag when the office is its own source", () => {
    assert.deepEqual(officeAssignmentTags("Employees", "same", "same"), [
      "Offices",
      "Employees",
      { type: "Office", id: "same" },
    ]);
  });

  it("ignores an empty source office id", () => {
    assert.equal(officeAssignmentTags("Employees", "dest", "").length, 3);
  });
});

describe("assign office members endpoints", () => {
  it("accepts an optional source office on both mutations", () => {
    const matches = endpointSource.match(/sourceOfficeId\?: string;/g) ?? [];
    assert.equal(matches.length, 2);
  });

  it("builds both invalidation lists from the shared helper", () => {
    assert.match(
      endpointSource,
      /officeAssignmentTags\("Employees", officeId, sourceOfficeId\)/,
    );
    assert.match(
      endpointSource,
      /officeAssignmentTags\("Equipment", officeId, sourceOfficeId\)/,
    );
  });
});

describe("useOfficeBulkActions reassign", () => {
  it("reports the office being reassigned from as the source", () => {
    const matches =
      bulkActionsSource.match(/sourceOfficeId: office\.id,/g) ?? [];
    assert.equal(matches.length, 2);
  });

  it("still posts to the destination office", () => {
    assert.match(bulkActionsSource, /companyId: dest\.subsidiaryId,/);
    assert.match(bulkActionsSource, /officeId: dest\.id,/);
  });
});
