import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import {
  INTEGRATION_ENTITY_COOKIE,
  INTEGRATION_RETURN_TO_COOKIE,
} from "./utils/auth/integrationConnectCookies";

const origin = "http://localhost:3000";

const respond = (path: string, cookies?: Record<string, string>) => {
  const request = new NextRequest(`${origin}${path}`);
  for (const [name, value] of Object.entries(cookies ?? {})) {
    request.cookies.set(name, value);
  }
  const response = middleware(request);
  return {
    status: response.status,
    location: response.headers.get("location"),
  };
};

describe("middleware existing redirects", () => {
  it("keeps a Finch settings callback on settings and restores the entity", () => {
    const result = respond(
      "/dashboard/settings?settingsType=integrations&service=finch&code=auth-code",
      { [INTEGRATION_ENTITY_COOKIE]: "entity-uk" },
    );

    assert.equal(result.status, 302);
    const location = new URL(result.location ?? "");
    assert.equal(location.pathname, "/dashboard/settings");
    assert.equal(location.searchParams.get("code"), "auth-code");
    assert.equal(location.searchParams.get("entity"), "entity-uk");
    assert.equal(location.searchParams.get("service"), "finch");
  });

  it("leaves a Finch settings callback alone when the entity is already present", () => {
    const result = respond(
      "/dashboard/settings?settingsType=integrations&service=finch&code=auth-code&entity=entity-uk",
      { [INTEGRATION_ENTITY_COOKIE]: "entity-uk" },
    );

    assert.equal(result.status, 200);
    assert.equal(result.location, null);
  });

  it("sends a Finch employees return to the HRIS tab with the starting entity", () => {
    const result = respond(
      "/dashboard/settings?settingsType=integrations&integration=finch&code=auth-code&integration_id=int-1",
      {
        [INTEGRATION_RETURN_TO_COOKIE]: "employees",
        [INTEGRATION_ENTITY_COOKIE]: "entity-ca",
      },
    );

    assert.equal(result.status, 302);
    const location = new URL(result.location ?? "");
    assert.equal(location.pathname, "/dashboard/employees");
    assert.equal(location.searchParams.get("tab"), "hris");
    assert.equal(location.searchParams.get("entity"), "entity-ca");
    assert.equal(location.searchParams.get("integration_id"), "int-1");
  });

  it("adds the starting entity on a Finch employees callback", () => {
    const result = respond(
      "/dashboard/employees?service=finch&code=auth-code",
      { [INTEGRATION_ENTITY_COOKIE]: "entity-uk" },
    );

    assert.equal(result.status, 302);
    const location = new URL(result.location ?? "");
    assert.equal(location.pathname, "/dashboard/employees");
    assert.equal(location.searchParams.get("entity"), "entity-uk");
    assert.equal(location.searchParams.get("code"), "auth-code");
  });

  it("still sends equip-employee to the marketplace", () => {
    const result = respond("/dashboard/equip-employee?entity=entity-uk");

    assert.equal(result.status, 307);
    const location = new URL(result.location ?? "");
    assert.equal(location.pathname, "/dashboard/equip-employee/marketplace");
  });

  it("still sends a Microsoft Entra code to settings integrations", () => {
    const result = respond(
      "/dashboard/settings/integration/microsoft-entra-id?code=ms-code",
    );

    assert.equal(result.status, 301);
    const location = new URL(result.location ?? "");
    assert.equal(location.pathname, "/dashboard/settings");
    assert.equal(location.searchParams.get("settingsType"), "integrations");
    assert.equal(
      location.searchParams.get("integration"),
      "microsoft-entra-id",
    );
    assert.equal(location.searchParams.get("code"), "ms-code");
  });

  it("does not redirect ordinary settings or employees pages", () => {
    assert.equal(
      respond("/dashboard/settings?settingsType=company").status,
      200,
    );
    assert.equal(respond("/dashboard/employees").status, 200);
  });
});
