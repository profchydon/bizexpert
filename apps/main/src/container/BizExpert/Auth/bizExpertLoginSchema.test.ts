import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { readBizExpertLoginError } from "./bizExpertLoginSchema";

test("readBizExpertLoginError reads API message", () => {
  const err = { response: { data: { message: "Invalid credentials" } } };
  assert.equal(readBizExpertLoginError(err), "Invalid credentials");
});

test("readBizExpertLoginError falls back", () => {
  assert.equal(readBizExpertLoginError(null), "Login failed");
});

test("BizExpert login uses BizExpert text as the logo", () => {
  const source = readFileSync(
    "src/container/BizExpert/Auth/BizExpertLogin.tsx",
    "utf8",
  );
  assert.equal(source.includes("logo_black"), false);
  assert.equal(source.includes("rayda_logo"), false);
  assert.equal(source.includes("loginBanner"), false);
  assert.equal(source.includes("BizExpert"), true);
});
