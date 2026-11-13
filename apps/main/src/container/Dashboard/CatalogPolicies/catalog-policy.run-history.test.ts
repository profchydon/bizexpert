import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { historyToRunEntry } from "./apiRowAdapters";
import {
  formatRunPayload,
  getRunDetailNotes,
  getRunOutcomeExplanation,
} from "./utils";

describe("catalog policy run history detail logic", () => {
  it("maps backend trigger history into drawer-ready row data", () => {
    const entry = historyToRunEntry(
      {
        id: "history-1",
        catalog_id: "catalog-1",
        rule_id: "rule-1",
        rule_name: "Senior policy",
        employee_id: "employee-1",
        employee_email: "employee@rayda.co",
        trigger_mode: "external_sync",
        trigger_source: "HRIS",
        outcome: "failed",
        failure_payload: { reason: "missing_kit" },
        context_payload: { source: "backend" },
        resolution_events: null,
        created_at: "2026-04-30T12:00:00Z",
      },
      [
        {
          id: "employee-1",
          first_name: "Ada",
          last_name: "Lovelace",
          email: "ada@rayda.co",
          job_title: "Engineer",
          country: "Ghana",
          country_code: "GH",
        } as any,
      ],
    );

    assert.equal(entry.employeeName, "Ada Lovelace");
    assert.equal(entry.employeeRole, "Engineer");
    assert.equal(entry.employeeCountry, "Ghana");
    assert.equal(entry.triggerSource, "HRIS");
    assert.deepEqual(entry.failurePayload, { reason: "missing_kit" });
  });

  it("formats backend payloads and explanations for the detail drawer", () => {
    const payload = formatRunPayload({ reason: "missing_kit" });

    assert.match(payload, /missing_kit/);
    assert.match(
      getRunOutcomeExplanation({
        id: "history-1",
        triggeredAt: "2026-04-30T12:00:00Z",
        triggerType: "HRIS",
        employeeName: "Ada Lovelace",
        employeeRole: "Engineer",
        employeeCountry: "Ghana",
        employeeCountryCode: "GH",
        outcome: "FAILED",
        supersededBy: null,
        onboardingRecordId: "employee-1",
        notes: null,
      }),
      /could not be applied/,
    );
    assert.equal(
      getRunDetailNotes({
        id: "history-1",
        triggeredAt: "2026-04-30T12:00:00Z",
        triggerType: "HRIS",
        employeeName: "Ada Lovelace",
        employeeRole: "Engineer",
        employeeCountry: "Ghana",
        employeeCountryCode: "GH",
        outcome: "FAILED",
        supersededBy: null,
        onboardingRecordId: "employee-1",
        notes: null,
        failurePayload: { reason: "missing_kit" },
      }),
      "missing_kit",
    );
  });

  it("maps operator override trigger history distinctly", () => {
    const entry = historyToRunEntry({
      id: "history-override",
      catalog_id: "catalog-1",
      rule_id: null,
      rule_name: null,
      employee_id: "employee-1",
      employee_email: "employee@rayda.co",
      trigger_mode: "override",
      trigger_source: null,
      outcome: "matched",
      failure_payload: null,
      context_payload: { origin: "operator_override" },
      resolution_events: null,
      created_at: "2026-04-30T12:00:00Z",
    });

    assert.equal(entry.triggerType, "OVERRIDE");
  });
});
