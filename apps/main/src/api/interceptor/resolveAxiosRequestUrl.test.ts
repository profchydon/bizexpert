import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { resolveAxiosRequestUrl } from "./resolveAxiosRequestUrl";

describe("resolveAxiosRequestUrl", () => {
  it("keeps absolute http(s) urls instead of prefixing the api base", () => {
    assert.equal(
      resolveAxiosRequestUrl(
        "https://dev-remote-api.rayda.co/api/v2/companies",
        "https://dev-remote-api.rayda.co/api/v2/fees/service-fees",
      ),
      "https://dev-remote-api.rayda.co/api/v2/fees/service-fees",
    );
  });

  it("joins relative urls onto the api base", () => {
    assert.equal(
      resolveAxiosRequestUrl(
        "https://dev-remote-api.rayda.co/api/v2/companies",
        "/company-1/fees/onboarding",
      ),
      "https://dev-remote-api.rayda.co/api/v2/companies/company-1/fees/onboarding",
    );
  });

  it("is used by the axios base query", () => {
    const source = readFileSync(
      join(process.cwd(), "src/api/interceptor/axiosBaseQuery.ts"),
      "utf8",
    );

    assert.match(source, /resolveAxiosRequestUrl\(baseUrl, scopedUrl\)/);
  });
});
