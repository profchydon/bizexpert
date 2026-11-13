import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { impactedToImpactRows, impactedToSelections } from "./apiRowAdapters";

describe("catalog policy API row adapters", () => {
  it("uses enriched impacted employee fields from the backend", () => {
    const impacted = [
      {
        id: "employee-1",
        first_name: "Ama",
        last_name: "Mensah",
        email: "ama@rayda.co",
        job_title: "Designer",
        level: "Management",
        country_id: "country-gh",
        country: "Ghana",
        country_code: "GH",
      },
    ];

    const impactRows = impactedToImpactRows({ impacted, employees: [] });
    const selections = impactedToSelections(impacted);

    assert.equal(impactRows[0].role, "Designer");
    assert.equal(impactRows[0].level, "Management");
    assert.equal(impactRows[0].country, "Ghana");
    assert.equal(impactRows[0].countryCode, "GH");
    assert.equal(selections[0].employeeRole, "Designer");
    assert.equal(selections[0].employeeLevel, "Management");
  });
});
