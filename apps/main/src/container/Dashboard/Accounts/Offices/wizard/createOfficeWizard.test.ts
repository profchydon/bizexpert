import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "CreateOfficeWizard.tsx"), "utf8");

describe("CreateOfficeWizard", () => {
  it("creates offices through the server mutation", () => {
    assert.match(source, /useCreateOfficeMutation/);
    assert.doesNotMatch(source, /addCreatedOffice|buildOfficeFromDraft/);
  });

  it("sends the verified create payload", () => {
    assert.match(
      source,
      /const payload = buildCreateOfficePayload\(\s*wizard\.draft,\s*parent\.id,\s*workspaceCompanyId,\s*\);/,
    );
    assert.match(
      source,
      /const workspaceCompanyId = useWorkspaceCompanyId\(\);/,
    );
    assert.match(
      source,
      /createOffice\(\{ companyId, payload \}\)\.unwrap\(\)/,
    );
  });

  it("does not log the create payload", () => {
    assert.equal(source.includes("console.log"), false);
    assert.match(
      source,
      /createOffice\(\{ companyId, payload \}\)\.unwrap\(\)/,
    );
  });

  it("surfaces server errors and pending state", () => {
    assert.match(source, /officeApiErrorMessage/);
    assert.match(source, /isSaving=\{createResult\.isLoading\}/);
    assert.match(
      readFileSync(join(dir, "CreateOfficeFooter.tsx"), "utf8"),
      /isLoading=\{isSaving\}/,
    );
  });

  it("sources admin options from the company directory", () => {
    assert.match(source, /useOfficeAdminOptions/);
  });

  it("sends the upgrade button to subscription settings", () => {
    assert.match(source, /push\(routes\.SETTINGS_SUBSCRIPTION\)/);
    assert.match(
      readFileSync(join(dir, "../components/OfficePlanModal.tsx"), "utf8"),
      /push\(routes\.SETTINGS_SUBSCRIPTION\)/,
    );
  });
});
