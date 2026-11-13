import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { clearAuthToken, getAuthToken } from "./authTokenStorage";
import {
  decryptAuthProfile,
  persistAuthSession,
  readAuthSession,
} from "./encryptAuthData";
import { MemoryStorage, installStorages } from "./testStorage";

const TEST_ENCRYPT_KEY = "dGVzdC1lbmNyeXB0LWtleS1mb3ItYXV0aA==";

describe("auth session persistence", () => {
  let localStorage: MemoryStorage;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENCRYPT_KEY = TEST_ENCRYPT_KEY;
    localStorage = new MemoryStorage();
    installStorages({ localStorage, sessionStorage: new MemoryStorage() });
  });

  afterEach(() => {
    clearAuthToken();
    installStorages({});
    delete process.env.NEXT_PUBLIC_ENCRYPT_KEY;
  });

  it("stores the auth token outside the encrypted profile blob", () => {
    const encryptedProfile = persistAuthSession({
      auth_token: "secret-token",
      user: { id: "user-1", first_name: "Ada", last_name: "Lovelace" } as never,
      company: { id: "company-1", name: "Rayda" } as never,
      entities: [
        {
          id: "entity-1",
          name: "Rayda UK",
          is_primary: false,
          country: "United Kingdom",
          parent_company_id: "company-1",
          role: "Administrator",
          scope: "entity",
          office_ids: [],
          via_global_admin: false,
        },
      ],
    });

    assert.equal(getAuthToken(), "secret-token");

    const profile = decryptAuthProfile(encryptedProfile);
    assert.equal(profile?.user?.id, "user-1");
    assert.equal(profile?.company?.name, "Rayda");
    assert.equal(profile?.entities?.[0]?.id, "entity-1");
    assert.equal("auth_token" in (profile ?? {}), false);
  });

  it("stores impersonation metadata in the encrypted profile", () => {
    const encryptedProfile = persistAuthSession({
      auth_token: "secret-token",
      user: { id: "user-1" } as never,
      company: { id: "company-1", name: "Rayda" } as never,
      impersonation: {
        admin_id: "admin-1",
        admin_name: "Ops Admin",
        company_id: "company-1",
        expires_at: "2026-01-01T00:00:00Z",
      },
    });

    const profile = decryptAuthProfile(encryptedProfile);
    assert.equal(profile?.impersonation?.admin_id, "admin-1");
    assert.equal(profile?.impersonation?.admin_name, "Ops Admin");
  });

  it("rehydrates auth state in a new tab from the stored token and profile", () => {
    const encryptedProfile = persistAuthSession({
      auth_token: "secret-token",
      user: { id: "user-1" } as never,
      company: { id: "company-1" } as never,
    });

    installStorages({ localStorage, sessionStorage: new MemoryStorage() });

    assert.deepEqual(readAuthSession(encryptedProfile), {
      auth_token: "secret-token",
      user: { id: "user-1" },
      company: { id: "company-1" },
      entities: undefined,
      impersonation: undefined,
    });
  });

  it("migrates legacy encrypted blobs that still contain the auth token", () => {
    const CryptoJS = require("crypto-js");
    const legacyBlob = CryptoJS.AES.encrypt(
      JSON.stringify({
        auth_token: "legacy-token",
        user: { id: "legacy-user" },
        company: { id: "legacy-company" },
      }),
      TEST_ENCRYPT_KEY,
    ).toString();

    const auth = readAuthSession(legacyBlob);

    assert.equal(auth?.auth_token, "legacy-token");
    assert.equal(getAuthToken(), "legacy-token");
    assert.equal(auth?.user?.id, "legacy-user");
  });
});
