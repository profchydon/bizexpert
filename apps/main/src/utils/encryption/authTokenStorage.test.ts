import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { clearAuthToken, getAuthToken, setAuthToken } from "./authTokenStorage";
import { MemoryStorage, installStorages } from "./testStorage";

describe("authTokenStorage", () => {
  let localStorage: MemoryStorage;
  let sessionStorage: MemoryStorage;

  beforeEach(() => {
    localStorage = new MemoryStorage();
    sessionStorage = new MemoryStorage();
    installStorages({ localStorage, sessionStorage });
  });

  afterEach(() => {
    installStorages({});
  });

  it("keeps the token in shared storage so other tabs stay signed in", () => {
    setAuthToken("secret-token");

    assert.equal(localStorage.getItem("rv2_auth_token"), "secret-token");
    assert.equal(sessionStorage.getItem("rv2_auth_token"), null);

    installStorages({ localStorage, sessionStorage: new MemoryStorage() });

    assert.equal(getAuthToken(), "secret-token");
  });

  it("promotes a tab-only token to shared storage on read", () => {
    sessionStorage.setItem("rv2_auth_token", "legacy-tab-token");

    assert.equal(getAuthToken(), "legacy-tab-token");
    assert.equal(localStorage.getItem("rv2_auth_token"), "legacy-tab-token");
    assert.equal(sessionStorage.getItem("rv2_auth_token"), null);
  });

  it("clears the token from both storages on logout", () => {
    setAuthToken("secret-token");
    sessionStorage.setItem("rv2_auth_token", "stale-tab-token");

    clearAuthToken();

    assert.equal(getAuthToken(), null);
    assert.equal(localStorage.getItem("rv2_auth_token"), null);
    assert.equal(sessionStorage.getItem("rv2_auth_token"), null);
  });

  it("falls back to tab storage when shared storage is unavailable", () => {
    installStorages({ sessionStorage });

    setAuthToken("secret-token");

    assert.equal(sessionStorage.getItem("rv2_auth_token"), "secret-token");
    assert.equal(getAuthToken(), "secret-token");
  });

  it("returns null when no storage is available", () => {
    installStorages({});

    assert.equal(getAuthToken(), null);
    assert.doesNotThrow(() => setAuthToken("secret-token"));
    assert.doesNotThrow(() => clearAuthToken());
  });
});
