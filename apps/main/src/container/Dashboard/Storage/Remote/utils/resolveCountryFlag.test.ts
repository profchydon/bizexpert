import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { flagByCode } from "@/app/dashboard/NavBar/flagByCode";
import { resolveCountryCode, resolveCountryFlag } from "./resolveCountryFlag";

describe("resolveCountryCode", () => {
  it("prefers a two-letter ISO code", () => {
    assert.equal(resolveCountryCode("af", "Nigeria"), "AF");
    assert.equal(resolveCountryCode("NG"), "NG");
  });

  it("resolves live inventory country names", () => {
    assert.equal(resolveCountryCode(undefined, "Afghanistan"), "AF");
    assert.equal(resolveCountryCode(undefined, "Nigeria"), "NG");
    assert.equal(resolveCountryCode(undefined, "United States"), "US");
  });
});

describe("resolveCountryFlag", () => {
  it("resolves Afghanistan by code and by name", () => {
    assert.equal(
      resolveCountryFlag("AF", "Afghanistan").Flag,
      flagByCode("AF"),
    );
    assert.equal(
      resolveCountryFlag(undefined, "Afghanistan").Flag,
      flagByCode("AF"),
    );
    assert.ok(resolveCountryFlag("AF", "Afghanistan").Flag);
  });

  it("keeps a visible mark when no flag asset exists", () => {
    const resolved = resolveCountryFlag("ZZ", "Unknownland");
    assert.equal(resolved.Flag, undefined);
    assert.equal(resolved.initials, "ZZ");
  });
});
