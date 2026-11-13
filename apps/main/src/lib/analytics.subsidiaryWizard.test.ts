import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import { trackSubsidiaryWizard } from "./subsidiaryWizardAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("subsidiary wizard analytics", () => {
  it("tracks a single event stream with step and status", () => {
    const captured: Array<{
      event: string;
      properties?: Record<string, unknown>;
    }> = [];
    setAnalyticsClientForTests({
      identify: () => {},
      group: () => {},
      reset: () => {},
      capture: (event, properties) => {
        captured.push({
          event,
          properties: properties as Record<string, unknown>,
        });
      },
      opt_out_capturing: () => {},
      opt_in_capturing: () => {},
      has_opted_out_capturing: () => false,
    });

    trackSubsidiaryWizard({ step: "details", status: "reached" });
    trackSubsidiaryWizard({ step: "details", status: "completed" });
    trackSubsidiaryWizard({ step: "confirm", status: "submitted" });
    assert.deepEqual(
      captured.map((entry) => entry.properties),
      [
        { step: "details", status: "reached" },
        { step: "details", status: "completed" },
        { step: "confirm", status: "submitted" },
      ],
    );
    assert.ok(captured.every((entry) => entry.event === "Subsidiary Wizard"));
  });

  it("is wired on step reached, completed, and submitted", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/CreateSubsidiaryWizard.tsx",
      ),
      "utf8",
    );
    assert.match(source, /status: "reached"/);
    assert.match(source, /status: "completed"/);
    assert.match(source, /status: "submitted"/);
  });
});
