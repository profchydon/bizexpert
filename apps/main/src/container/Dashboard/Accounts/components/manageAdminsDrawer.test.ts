import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("ManageAdminsDrawer admin field", () => {
  it("uses the entity admin picker with country flags", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/ManageAdminsDrawer.tsx",
      ),
      "utf8",
    );

    assert.match(source, /OfficeAdminPicker/);
    assert.match(source, /useOfficeAdminOptions\(!isOpen, undefined, \{/);
    assert.match(source, /filterByCountry: false/);
    assert.match(source, /label="Add an admin"/);
    assert.match(source, /isLoading=\{manager\.isInviting\}/);
    assert.match(source, /pendingValue=\{manager\.invitingId/);
    assert.match(
      source,
      /withDirectoryAdminState\(directory\.options, manager\.rows\)/,
    );
    assert.doesNotMatch(source, /manager\.error/);
    assert.doesNotMatch(source, /WizardAdminPicker/);
  });
});
