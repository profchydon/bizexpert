import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "CloseOfficeModal.tsx"), "utf8");

describe("CloseOfficeModal", () => {
  it("counts employees and assets from the office-scoped list queries", () => {
    assert.match(source, /useOfficeEmployeesPage\(officeId, 1\)/);
    assert.match(
      source,
      /useOfficeAssetsPage\(officeId, 1, office\?\.currency \?\? ""\)/,
    );
    assert.match(
      source,
      /buildCloseOfficeChecks\(employeesPage\.total, assetsPage\.total\)/,
    );
  });

  it("does not read counts from the backend close_readiness payload", () => {
    assert.doesNotMatch(source, /readiness/);
    assert.doesNotMatch(source, /OfficeCloseReadiness/);
  });

  it("keeps the close button disabled while counts are loading", () => {
    assert.match(
      source,
      /isCounting = employeesPage\.isLoading \|\| assetsPage\.isLoading/,
    );
    assert.match(source, /canClose = !isCounting && canCloseOffice\(checks\)/);
    assert.match(source, /disabled=\{!canClose\}/);
  });
});
