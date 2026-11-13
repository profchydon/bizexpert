import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  FINCH_CALLBACK_REDIRECT_STATUS,
  buildFinchCallbackSearchParams,
  finchCallbackDestinationPath,
  isFinchEmployeesCallback,
  isFinchOAuthCallback,
  resolveFinchCallbackEntity,
  shouldRestoreFinchCallback,
} from "./finchCallbackRedirect";

describe("finchCallbackRedirect", () => {
  it("matches the Finch OAuth callback on settings", () => {
    assert.equal(
      isFinchOAuthCallback({
        pathname: "/dashboard/settings",
        settingsType: "integrations",
        integration: "finch",
        code: "auth-code",
      }),
      true,
    );
    assert.equal(
      isFinchOAuthCallback({
        pathname: "/dashboard/settings",
        settingsType: "integrations",
        integration: null,
        service: "finch",
        code: "auth-code",
      }),
      true,
    );
    assert.equal(
      isFinchOAuthCallback({
        pathname: "/dashboard/settings",
        settingsType: "integrations",
        integration: "bamboohr",
        code: "auth-code",
      }),
      false,
    );
  });

  it("restores the workspace only when the callback is missing it", () => {
    assert.equal(
      shouldRestoreFinchCallback({
        pathname: "/dashboard/settings",
        destinationPath: "/dashboard/settings",
        urlEntity: null,
        entity: "entity-uk",
      }),
      true,
    );
    assert.equal(
      shouldRestoreFinchCallback({
        pathname: "/dashboard/settings",
        destinationPath: "/dashboard/settings",
        urlEntity: "entity-uk",
        entity: "entity-uk",
      }),
      false,
    );
  });

  it("matches a Finch return that already landed on employees", () => {
    assert.equal(
      isFinchEmployeesCallback({
        pathname: "/dashboard/employees",
        code: "auth-code",
        service: "finch",
        integration: null,
      }),
      true,
    );
    assert.equal(
      isFinchEmployeesCallback({
        pathname: "/dashboard/employees",
        code: "auth-code",
        service: null,
        integration: null,
      }),
      false,
    );
  });

  it("sends employees return_to to the HRIS tab path", () => {
    assert.equal(
      finchCallbackDestinationPath("employees"),
      "/dashboard/employees",
    );
    assert.equal(finchCallbackDestinationPath(), "/dashboard/settings");
  });

  it("prefers the URL entity over the connect cookie", () => {
    assert.equal(
      resolveFinchCallbackEntity({
        urlEntity: "entity-ca",
        cookieEntity: "entity-uk",
      }),
      "entity-ca",
    );
    assert.equal(
      resolveFinchCallbackEntity({
        urlEntity: null,
        cookieEntity: "entity-ca",
      }),
      "entity-ca",
    );
  });

  it("keeps the starting entity on both callback destinations", () => {
    assert.equal(
      buildFinchCallbackSearchParams({
        code: "auth-code",
        returnToEmployees: true,
        entity: "entity-ca",
      }).toString(),
      "tab=hris&service=finch&code=auth-code&integration=finch&entity=entity-ca",
    );
    assert.equal(
      buildFinchCallbackSearchParams({
        code: "auth-code",
        returnToEmployees: false,
        entity: "entity-ca",
      }).toString(),
      "settingsType=integrations&service=finch&code=auth-code&entity=entity-ca",
    );
  });

  it("uses a temporary redirect so a second connect is not stuck on a cached 301", () => {
    assert.equal(FINCH_CALLBACK_REDIRECT_STATUS, 302);
  });
});
