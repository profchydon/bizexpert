import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { finchConnectReturnPath } from "./finchConnectReturnPath";

describe("finchConnectReturnPath", () => {
  it("keeps the entity on the employees HRIS tab", () => {
    assert.equal(
      finchConnectReturnPath({
        returnTo: "employees",
        pathname: "/dashboard/employees",
        search: "?tab=hris&entity=entity-ca&code=abc",
      }),
      "/dashboard/employees?tab=hris&entity=entity-ca",
    );
  });

  it("keeps the entity after clearing settings callback params", () => {
    assert.equal(
      finchConnectReturnPath({
        pathname: "/dashboard/settings",
        search:
          "?settingsType=integrations&integration=bamboohr&code=abc&entity=entity-ca",
      }),
      "/dashboard/settings?settingsType=integrations&entity=entity-ca",
    );
  });
});
