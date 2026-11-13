import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INTEGRATION_ENTITY_COOKIE,
  INTEGRATION_RETURN_TO_COOKIE,
  integrationCookiePair,
  connectWorkspaceEntity,
  readEntityFromLocationSearch,
} from "./integrationConnectCookies";

describe("integrationConnectCookies", () => {
  it("reads the entity query param from a location search", () => {
    assert.equal(
      readEntityFromLocationSearch(
        "?tab=hris&entity=01a08212-e8f6-72ed-b425-e5d5691f5cac",
      ),
      "01a08212-e8f6-72ed-b425-e5d5691f5cac",
    );
    assert.equal(readEntityFromLocationSearch("tab=hris"), null);
    assert.equal(readEntityFromLocationSearch(""), null);
  });

  it("keeps the active workspace when the settings url dropped entity", () => {
    assert.equal(
      connectWorkspaceEntity("?settingsType=integrations", "entity-uk"),
      "entity-uk",
    );
    assert.equal(
      connectWorkspaceEntity("?entity=entity-ca", "entity-uk"),
      "entity-ca",
    );
    assert.equal(connectWorkspaceEntity("", null), null);
  });

  it("serializes a short-lived same-site cookie", () => {
    assert.equal(
      integrationCookiePair(INTEGRATION_ENTITY_COOKIE, "entity-11"),
      "integration_entity=entity-11; path=/; max-age=300; samesite=lax",
    );
    assert.equal(
      integrationCookiePair(INTEGRATION_RETURN_TO_COOKIE, "employees"),
      "integration_return_to=employees; path=/; max-age=300; samesite=lax",
    );
  });
});
