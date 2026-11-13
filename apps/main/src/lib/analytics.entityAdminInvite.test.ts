import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import { trackEntityAdminInvite } from "./entityAdminInviteAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("entity admin invite analytics", () => {
  it("tracks viewed and completed with invitation ids", () => {
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

    trackEntityAdminInvite({
      action: "viewed",
      invitation_id: "inv-1",
      entity_id: "ent-1",
    });
    trackEntityAdminInvite({ action: "completed", invitation_id: "inv-1" });
    assert.equal(captured[0]?.event, "Entity Admin Invite");
    assert.deepEqual(captured[0]?.properties, {
      action: "viewed",
      invitation_id: "inv-1",
      entity_id: "ent-1",
    });
    assert.equal(captured[1]?.properties?.action, "completed");
  });

  it("is wired on intro view and accept/signup complete", () => {
    const panel = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EntityAdminInvite/EntityAdminInvitePanel.tsx",
      ),
      "utf8",
    );
    const signup = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EmployeeInvite/UserInviation/useEmployeeInviteSignup.ts",
      ),
      "utf8",
    );
    assert.match(panel, /action: "viewed"/);
    assert.match(panel, /action: "completed"/);
    assert.match(signup, /isEntityAdminFlow/);
    assert.match(signup, /action: "completed"/);
  });
});
