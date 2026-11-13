import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  verificationRequestAuth,
  verificationRequestParams,
} from "./verificationRequestAuth";

const apiDir = join(
  process.cwd(),
  "src/api/baseQueries/employeeVerificationApi",
);

describe("verificationRequestAuth", () => {
  it("skips session auth so invite tokens are not bound to a logged-in user", () => {
    assert.deepEqual(verificationRequestAuth, { skipAuth: true });
  });

  it("sends the invite token without encrypting the path", () => {
    assert.deepEqual(verificationRequestParams("invite-token"), {
      token: "invite-token",
      excludePathFromEncryption: true,
    });
  });
});

describe("employee verification endpoints stay unauthenticated", () => {
  const files = [
    "getVerificationData.ts",
    "updateVerificationData.ts",
    "confirmVerificationData.ts",
  ];

  for (const file of files) {
    it(`${file} uses the shared skipAuth helper`, () => {
      const source = readFileSync(join(apiDir, file), "utf8");
      assert.match(source, /verificationRequestAuth/);
      assert.match(source, /verificationRequestParams\(token\)/);
      assert.doesNotMatch(source, /skipAuth:\s*false/);
    });
  }
});

describe("verify-delivery page", () => {
  it("reads company from the invite query so guests can load the form", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/employee/verify-delivery/page.tsx"),
      "utf8",
    );

    assert.match(source, /company\?: string/);
    assert.match(source, /companyId=\{companyId \|\| company \|\| ""\}/);
  });
});
