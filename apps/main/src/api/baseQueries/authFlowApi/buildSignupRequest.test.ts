import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildSignupRequest } from "./buildSignupRequest";

const user = { first_name: "Ada", email: "ada@acme.com" };
const company = { email: "ada@acme.com" };

test("skip domain check is sent as a query param, never in the body", () => {
  const request = buildSignupRequest({ user, company, skipDomainCheck: true });

  assert.deepEqual(request.params, { skip_domain_check: true });
  assert.deepEqual(request.data, { user, company });
  assert.equal("skipDomainCheck" in request.data, false);
  assert.equal("skip_domain_check" in request.data, false);
});

test("the query param is omitted entirely when the flag is not set", () => {
  const request = buildSignupRequest({ user, company });

  assert.equal("params" in request, false);
  assert.deepEqual(request.data, { user, company });
});

test("the query param is omitted when the flag is explicitly false", () => {
  const request = buildSignupRequest({
    user,
    company,
    skipDomainCheck: false,
  });

  assert.equal("params" in request, false);
});

test("signup always posts unauthenticated to /companies", () => {
  const request = buildSignupRequest({ user, company, skipDomainCheck: true });

  assert.equal(request.url, "/companies");
  assert.equal(request.method, "POST");
  assert.equal(request.skipAuth, true);
});

test("new onboarding signup opts into skipping the domain check", () => {
  const source = readFileSync(
    "src/container/NewOnboarding/Signup/SignupForm.tsx",
    "utf8",
  );

  assert.match(source, /skipDomainCheck:\s*true/);
});

test("legacy onboarding signup keeps the domain check so the join dialog still shows", () => {
  const source = readFileSync(
    "src/container/Onboarding/Signup/index.tsx",
    "utf8",
  );

  assert.equal(source.includes("skipDomainCheck"), false);
  assert.match(source, /ExistingDomainDialog/);
});
