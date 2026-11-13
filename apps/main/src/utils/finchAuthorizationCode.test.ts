import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  exchangeFinchAuthorizationCodeOnce,
  resetFinchAuthorizationCodeExchangeForTests,
  shouldExchangeFinchAuthorizationCode,
  shouldOpenFinchConfigureTab,
  shouldStartNewFinchConnect,
} from "./finchAuthorizationCode";

describe("shouldExchangeFinchAuthorizationCode", () => {
  it("is true only for a Finch callback with company and code", () => {
    assert.equal(
      shouldExchangeFinchAuthorizationCode({
        code: "auth-code",
        service: "finch",
        companyId: "company-1",
      }),
      true,
    );
    assert.equal(
      shouldExchangeFinchAuthorizationCode({
        code: "auth-code",
        service: "finch",
        companyId: "",
      }),
      false,
    );
    assert.equal(
      shouldExchangeFinchAuthorizationCode({
        code: "auth-code",
        service: "google",
        companyId: "company-1",
      }),
      false,
    );
  });
});

describe("shouldOpenFinchConfigureTab", () => {
  it("opens configure after a Finch callback even when integration is the service name", () => {
    assert.equal(
      shouldOpenFinchConfigureTab({
        code: "auth-code",
        integration: "finch",
        slug: "bamboohr",
      }),
      true,
    );
    assert.equal(
      shouldOpenFinchConfigureTab({
        code: "encrypted-token",
        integration: "bamboohr",
        slug: "bamboohr",
      }),
      true,
    );
    assert.equal(
      shouldOpenFinchConfigureTab({
        code: null,
        integration: "bamboohr",
        slug: "bamboohr",
      }),
      false,
    );
  });
});

describe("shouldStartNewFinchConnect", () => {
  it("does not start a new OAuth when a callback code is already present", () => {
    assert.equal(shouldStartNewFinchConnect("auth-code"), false);
    assert.equal(shouldStartNewFinchConnect(null), true);
    assert.equal(shouldStartNewFinchConnect(undefined), true);
  });
});

describe("exchangeFinchAuthorizationCodeOnce", () => {
  beforeEach(() => {
    resetFinchAuthorizationCodeExchangeForTests();
  });

  it("runs the exchange only once per authorization code", async () => {
    let calls = 0;
    const run = async () => {
      calls += 1;
      return { access: "tok" };
    };

    const [first, second] = await Promise.all([
      exchangeFinchAuthorizationCodeOnce("code-a", run),
      exchangeFinchAuthorizationCodeOnce("code-a", run),
    ]);

    assert.equal(calls, 1);
    assert.equal(first, second);
  });
});
