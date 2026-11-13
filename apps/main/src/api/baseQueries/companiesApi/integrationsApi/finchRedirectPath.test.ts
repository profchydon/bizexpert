import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFinchRedirectPath } from "./finchRedirectPath";

describe("buildFinchRedirectPath", () => {
  it("sends return_to so Finch uses the employee callback", () => {
    assert.equal(
      buildFinchRedirectPath({
        companyId: "entity-ca",
        provider: "bamboohr",
        return_to: "employees",
      }),
      "/entity-ca/integrations/finch/redirect?provider=bamboohr&return_to=employees",
    );
  });
});
