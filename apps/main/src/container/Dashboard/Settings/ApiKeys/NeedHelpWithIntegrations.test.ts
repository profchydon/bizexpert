import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import { isSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import { INTEGRATION_DOCS_URL } from "./integrationDocsUrl.ts";

describe("NeedHelpWithIntegrations", () => {
  const source = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Settings/ApiKeys/NeedHelpWithIntegrations.tsx",
    ),
    "utf8",
  );

  it("opens only the existing https docs url through the shared helper", () => {
    assert.equal(INTEGRATION_DOCS_URL, "https://docs.rayda.co/quickstart");
    assert.equal(isSafeRedirectUrl(INTEGRATION_DOCS_URL), true);
    assert.match(source, /openSafeRedirectUrl\(INTEGRATION_DOCS_URL\)/);
    assert.equal(source.includes("window.open"), false);
  });
});
