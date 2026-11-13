import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  FEATURE_FLAGS,
  getRawAppEnv,
  resolveAppEnv,
  withEnvSuffix,
} from "../featureFlags";

describe("resolveAppEnv", () => {
  it("maps known environments directly", () => {
    assert.equal(resolveAppEnv("production"), "production");
    assert.equal(resolveAppEnv("staging"), "staging");
    assert.equal(resolveAppEnv("development"), "development");
  });

  it("falls back to development for unknown or missing values", () => {
    assert.equal(resolveAppEnv(), "development");
    assert.equal(resolveAppEnv(null), "development");
    assert.equal(resolveAppEnv("test"), "development");
  });
});

describe("withEnvSuffix", () => {
  const orderScreenBase = "remote_orderScreen_ui_update";
  const orderFlowsBase = "remote_orderFlows_ui_update";
  const accountManagementBase = "remote_accountManagement";
  const remoteStorageBase = "remote_storage";

  it("appends the matching environment suffix", () => {
    assert.equal(
      withEnvSuffix(orderScreenBase, "production"),
      `${orderScreenBase}_prod`,
    );
    assert.equal(
      withEnvSuffix(orderScreenBase, "staging"),
      `${orderScreenBase}_staging`,
    );
    assert.equal(
      withEnvSuffix(orderScreenBase, "development"),
      `${orderScreenBase}_dev`,
    );
    assert.equal(
      withEnvSuffix(orderFlowsBase, "production"),
      `${orderFlowsBase}_prod`,
    );
    assert.equal(
      withEnvSuffix(accountManagementBase, "production"),
      `${accountManagementBase}_prod`,
    );
    assert.equal(
      withEnvSuffix(accountManagementBase, "staging"),
      `${accountManagementBase}_staging`,
    );
    assert.equal(
      withEnvSuffix(accountManagementBase, "development"),
      `${accountManagementBase}_dev`,
    );
    assert.equal(
      withEnvSuffix(remoteStorageBase, "production"),
      `${remoteStorageBase}_prod`,
    );
    assert.equal(
      withEnvSuffix(remoteStorageBase, "staging"),
      `${remoteStorageBase}_staging`,
    );
    assert.equal(
      withEnvSuffix(remoteStorageBase, "development"),
      `${remoteStorageBase}_dev`,
    );
  });

  it("defaults to the dev variant when the environment is unknown", () => {
    assert.equal(withEnvSuffix(orderScreenBase), `${orderScreenBase}_dev`);
    assert.equal(withEnvSuffix(orderFlowsBase), `${orderFlowsBase}_dev`);
    assert.match(
      FEATURE_FLAGS.REMOTE_STORAGE,
      /^remote_storage_(dev|staging|prod)$/,
    );
  });
});

describe("getRawAppEnv", () => {
  const originalAppEnv = process.env.NEXT_PUBLIC_APP_ENV;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_ENV = originalAppEnv;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("prefers NEXT_PUBLIC_APP_ENV over NODE_ENV", () => {
    process.env.NEXT_PUBLIC_APP_ENV = "staging";
    process.env.NODE_ENV = "production";
    assert.equal(getRawAppEnv(), "staging");
  });

  it("falls back to NODE_ENV when NEXT_PUBLIC_APP_ENV is unset", () => {
    delete process.env.NEXT_PUBLIC_APP_ENV;
    process.env.NODE_ENV = "production";
    assert.equal(getRawAppEnv(), "production");
  });
});
