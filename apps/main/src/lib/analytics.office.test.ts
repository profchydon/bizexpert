import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import { trackOfficeUpdated } from "./officeAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("office analytics", () => {
  it("tracks office actions on one event name", () => {
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

    trackOfficeUpdated({ action: "created", office_id: "off-1" });
    trackOfficeUpdated({ action: "edited", office_id: "off-1" });
    trackOfficeUpdated({ action: "closed", office_id: "off-1" });
    trackOfficeUpdated({ action: "employee_added", office_id: "off-1" });
    assert.ok(captured.every((entry) => entry.event === "Office Updated"));
    assert.deepEqual(
      captured.map((entry) => entry.properties?.action),
      ["created", "edited", "closed", "employee_added"],
    );
  });

  it("is wired on create, edit, close, and add-employee success", () => {
    const create = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/wizard/CreateOfficeWizard.tsx",
      ),
      "utf8",
    );
    const edit = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/detail/components/EditOfficeModal.tsx",
      ),
      "utf8",
    );
    const detail = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/OfficeDetailPage.tsx",
      ),
      "utf8",
    );
    const add = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/detail/components/AddOfficeEmployeeModal.tsx",
      ),
      "utf8",
    );
    assert.match(create, /action: "created"/);
    assert.match(edit, /action: "edited"/);
    assert.match(detail, /action: "closed"/);
    assert.match(add, /action: "employee_added"/);
  });
});
