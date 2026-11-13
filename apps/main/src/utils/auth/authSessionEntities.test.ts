import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("auth session entity memberships", () => {
  it("types login confirmation and profile responses with entities", () => {
    const loginConfirmation = readFileSync(
      "src/api/baseQueries/authFlowApi/loginConfirmation.ts",
      "utf8",
    );
    const getUserProfile = readFileSync(
      "src/api/baseQueries/userApi/getUserProfile.ts",
      "utf8",
    );

    assert.match(loginConfirmation, /entities\?: EntityMembership\[\]/);
    assert.match(getUserProfile, /entities\?: EntityMembership\[\]/);
  });

  it("persists entities from login confirmation and profile refresh", () => {
    const callback = readFileSync("src/container/Auth/Callback.tsx", "utf8");
    const refreshHook = readFileSync(
      "src/hooks/useRefreshAuthSession.ts",
      "utf8",
    );
    const authUser = readFileSync("src/utils/useAuthUser/index.ts", "utf8");

    assert.match(callback, /entities,/);
    assert.match(refreshHook, /entities: profile\.data\.entities/);
    assert.match(authUser, /getEntityMemberships/);
  });
});
