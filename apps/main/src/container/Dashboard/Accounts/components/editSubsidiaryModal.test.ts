import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  editSubsidiaryFieldInputClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryFooterButtonClass,
} from "./editSubsidiaryModalClasses";

describe("editSubsidiaryModalClasses", () => {
  it("matches the reference edit modal shell and field sizing", () => {
    assert.match(editSubsidiaryModalContentClass, /max-w-lg/);
    assert.match(editSubsidiaryModalContentClass, /rounded-2xl/);
    assert.match(editSubsidiaryModalContentClass, /sm:rounded-2xl/);
    assert.match(editSubsidiaryModalContentClass, /shadow-xl/);
    assert.match(editSubsidiaryFieldInputClass, /h-\[44px\]/);
    assert.match(editSubsidiaryFieldInputClass, /rounded-lg/);
    assert.match(editSubsidiaryFooterButtonClass, /w-full/);
  });
});

describe("EditSubsidiaryModal", () => {
  it("uses dedicated edit modal classes instead of preflight close styling", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EditSubsidiaryModal.tsx",
      ),
      "utf8",
    );

    assert.match(source, /editSubsidiaryModalContentClass/);
    assert.match(source, /editSubsidiaryFooterButtonClass/);
    assert.doesNotMatch(source, /preflightModalContentClass/);
    assert.doesNotMatch(source, /WizardAdminPicker/);
  });
});

describe("SubsidiaryDetailHeader edit action", () => {
  it("renders Edit alongside Close when canEdit is true", () => {
    const header = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailHeader.tsx",
      ),
      "utf8",
    );
    const actions = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EntityDetailHeaderActions.tsx",
      ),
      "utf8",
    );

    assert.match(header, /canEdit/);
    assert.match(header, /entityDetailHeaderActions/);
    assert.match(actions, /\n\s*Edit\n/);
    assert.match(actions, /onEdit/);
    assert.match(actions, /Manage admins/);
    assert.match(actions, /Replace card/);
    assert.match(actions, /Add card/);
  });
});

describe("SubsidiaryDetailPage edit flow", () => {
  it("wires the edit modal to the update entity API", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailView.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SubsidiaryDetailModals/);
    assert.match(source, /useSubsidiaryDetailEdit/);
    assert.match(source, /onManageAdmins/);
    assert.doesNotMatch(source, /adminUserIds=\{detail\.adminUserIds\}/);
    assert.match(source, /canEdit/);
  });
});

describe("EditSubsidiaryModal primary entities", () => {
  it("locks the name field for primary entities", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EditSubsidiaryModal.tsx",
      ),
      "utf8",
    );

    assert.match(source, /isPrimary/);
    assert.doesNotMatch(source, /WizardAdminPicker/);
    assert.match(source, /EditCardOnFileField/);
    assert.match(source, /onReplaceCard/);
    assert.match(source, /isReplacingCard/);
    assert.match(source, /billingEntityName/);
  });
});

describe("EditSubsidiaryModal card replace", () => {
  it("starts consent without closing the modal", () => {
    const detailView = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useSubsidiaryDetailCard.ts",
      ),
      "utf8",
    );
    const page = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailView.tsx",
      ),
      "utf8",
    );
    const modal = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EditSubsidiaryModal.tsx",
      ),
      "utf8",
    );
    const cardField = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EditCardOnFileField.tsx",
      ),
      "utf8",
    );

    assert.match(detailView, /handleReplaceCard/);
    assert.match(detailView, /beginCardReplace/);
    assert.match(detailView, /beginCardCapture/);
    assert.match(detailView, /subsidiary\.cardOnFile/);
    assert.match(page, /setReplaceCardOpen\(true\)/);
    assert.match(page, /isReplacingCard=\{card\.isCapturing\}/);
    assert.doesNotMatch(
      detailView,
      /async function handleReplaceCard\(\) \{\n    await beginCardCapture/,
    );
    assert.match(modal, /isUpdating=\{isReplacingCard\}/);
    assert.match(cardField, /isLoading=\{isUpdating\}/);
  });
});
