import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  getClientEncryptKey,
  hasClientEncryptKey,
} from "./getClientEncryptKey";

describe("getClientEncryptKey", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENCRYPT_KEY;
  });

  it("returns the configured client encrypt key", () => {
    process.env.NEXT_PUBLIC_ENCRYPT_KEY = "abc123";
    assert.equal(getClientEncryptKey(), "abc123");
    assert.equal(hasClientEncryptKey(), true);
  });

  it("throws when the key is missing", () => {
    assert.throws(() => getClientEncryptKey(), /NEXT_PUBLIC_ENCRYPT_KEY/);
    assert.equal(hasClientEncryptKey(), false);
  });
});
