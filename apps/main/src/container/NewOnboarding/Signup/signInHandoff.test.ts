import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const form = readFileSync(
  "src/container/NewOnboarding/Signup/SignupForm.tsx",
  "utf8",
);
const endpoint = readFileSync(
  "src/api/baseQueries/authFlowApi/loginAuthorization.ts",
  "utf8",
);

test("sign in goes straight to sso instead of the interim login page", () => {
  assert.equal(form.includes("/auth/login"), false);
  assert.match(form, /useLoginAuthorizationMutation/);
  assert.match(
    form,
    /globalThis\.location\.assign\(session\.data\.redirect_url\)/,
  );
});

test("the handoff uses the same authorization endpoint the login page used", () => {
  assert.match(endpoint, /url: `\/sessions\/authorization`/);
  assert.match(endpoint, /skipAuth: true/);
});

test("a stale client session is cleared before authorizing, as on the login page", () => {
  const clearIndex = form.indexOf("clearClientAuthSession(dispatch");
  const authorizeIndex = form.indexOf("loginAuthorization()");

  assert.ok(clearIndex > 0);
  assert.ok(clearIndex < authorizeIndex);
  assert.match(form, /preservePostLoginRedirect: true/);
});

test("the sign in button cannot submit the signup form", () => {
  const signInButton = form.slice(form.indexOf("Already have an account?"));

  assert.match(signInButton, /type="button"/);
  assert.match(signInButton, /onClick=\{handleSignIn\}/);
});

test("the button reports progress while the authorization call is in flight", () => {
  assert.match(form, /isLoading=\{loginProps\.isLoading\}/);
});

test("a failed authorization surfaces the api message", () => {
  assert.match(form, /showApiError\(error\)/);
  assert.doesNotMatch(form, /displayErrorMessage\(title, description\)/);
});
