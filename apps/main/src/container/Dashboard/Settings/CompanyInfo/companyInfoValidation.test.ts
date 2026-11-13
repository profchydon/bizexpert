import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  companyNameHint,
  phoneHint,
  websiteHint,
} from "./companyInfoValidation";

describe("company info validation", () => {
  it("requires a company name and a website with a real domain", () => {
    assert.equal(companyNameHint("  "), "Enter a company name.");
    assert.equal(companyNameHint("Acme UK Ltd"), undefined);
    assert.equal(
      websiteHint("acme.c"),
      "Enter a valid website URL, like acme.com.",
    );
    assert.equal(websiteHint("https://acme.com"), undefined);
  });

  it("rejects a phone number that is not dialable", () => {
    assert.equal(phoneHint(""), "Enter a phone number.");
    assert.equal(phoneHint("123"), "Enter a valid phone number.");
    assert.equal(phoneHint("+2348000000000"), undefined);
  });
});
