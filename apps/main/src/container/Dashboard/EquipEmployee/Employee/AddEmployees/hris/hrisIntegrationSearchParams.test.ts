import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildHrisTabQueryWithoutIntegrationParams,
  hasHrisIntegrationQueryParams,
  shouldReplaceEmployeesPath,
} from "./hrisIntegrationSearchParams";

describe("hrisIntegrationSearchParams", () => {
  it("detects integration-related query params", () => {
    const params = new URLSearchParams("tab=hris&integration=gusto");
    assert.equal(hasHrisIntegrationQueryParams(params), true);
    assert.equal(buildHrisTabQueryWithoutIntegrationParams(params), "tab=hris");
  });

  it("skips replace when the query is already clean", () => {
    const params = new URLSearchParams("tab=hris");
    assert.equal(hasHrisIntegrationQueryParams(params), false);
    assert.equal(buildHrisTabQueryWithoutIntegrationParams(params), null);
    assert.equal(shouldReplaceEmployeesPath(params, "tab=hris"), false);
  });

  it("keeps the workspace entity when clearing integration params", () => {
    const params = new URLSearchParams(
      "tab=hris&entity=entity-ca&integration=bamboohr&code=abc",
    );
    assert.equal(
      buildHrisTabQueryWithoutIntegrationParams(params),
      "tab=hris&entity=entity-ca",
    );
  });
});
