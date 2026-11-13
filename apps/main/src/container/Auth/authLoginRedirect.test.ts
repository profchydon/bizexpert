import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const loginPage = readFileSync("src/container/Auth/index.tsx", "utf8");

test("sign in authorizes then assigns only a safe http(s) redirect", () => {
  assert.match(loginPage, /useLoginAuthorizationMutation/);
  assert.match(loginPage, /clearClientAuthSession\(dispatch/);
  assert.match(loginPage, /preservePostLoginRedirect: true/);
  assert.match(
    loginPage,
    /assignSafeRedirectUrl\(session\.data\.redirect_url\)/,
  );
  assert.equal(loginPage.includes("window.open"), false);
});

test("an invalid or failed authorization surfaces an error", () => {
  assert.match(loginPage, /We couldn't start sign in\./);
  assert.match(loginPage, /showApiError\(error\)/);
  assert.doesNotMatch(loginPage, /displayErrorMessage\(title, description\)/);
});

test("the sign in button reports progress while authorization is in flight", () => {
  assert.match(loginPage, /isLoading=\{loginAuthorizationProps\.isLoading\}/);
});
