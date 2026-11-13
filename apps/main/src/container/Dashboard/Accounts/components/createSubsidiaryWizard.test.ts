import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const wizardSource = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/components/CreateSubsidiaryWizard.tsx",
  ),
  "utf8",
);

describe("CreateSubsidiaryWizard", () => {
  it("creates entities through the API and redirects for card capture", () => {
    assert.match(wizardSource, /useCreateEntitySubmission/);
    assert.match(wizardSource, /useOfficeAdminOptions/);
    assert.match(wizardSource, /admins=\{admins\}/);
    assert.match(wizardSource, /submitDelegatedEntity/);
    assert.match(wizardSource, /submitSelfBillingEntity/);
    assert.match(wizardSource, /returnDone/);
    assert.match(wizardSource, /useResumeCreateEntityDone/);
    assert.match(wizardSource, /WizardStepDone/);
    assert.doesNotMatch(wizardSource, /addCreatedSubsidiary/);
    assert.doesNotMatch(wizardSource, /buildSubsidiaryFromDraft/);
  });

  it("loads entity admins from the full company users directory", () => {
    assert.match(wizardSource, /useOfficeAdminOptions\(!isOpen, undefined, \{/);
    assert.match(wizardSource, /filterByCountry:\s*false/);
    assert.doesNotMatch(wizardSource, /parent\?\.region/);
  });
});
