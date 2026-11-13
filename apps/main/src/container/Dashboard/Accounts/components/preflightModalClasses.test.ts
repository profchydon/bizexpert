import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import {
  preflightCheckFailIconClass,
  preflightCheckPassIconClass,
  preflightConfirmInputClass,
  preflightDetailCloseButtonClass,
  preflightModalContentClass,
  preflightModalDescriptionClass,
  preflightModalFooterClass,
  preflightModalTitleClass,
} from "./preflightModalClasses";

describe("preflightModalClasses", () => {
  it("maps reference modal shell tokens to app theme colors", () => {
    assert.match(preflightModalContentClass, /max-w-md/);
    assert.match(preflightModalContentClass, /rounded-2xl/);
    assert.match(preflightModalContentClass, /bg-white p-6 shadow-xl/);
    assert.match(
      preflightModalTitleClass,
      /text-base font-semibold text-gray-900/,
    );
    assert.match(preflightModalDescriptionClass, /text-sm text-gray-600/);
    assert.match(preflightModalFooterClass, /grid grid-cols-2 gap-3/);
    assert.match(preflightCheckPassIconClass, /text-success-600/);
    assert.match(preflightCheckFailIconClass, /text-error-600/);
    assert.match(preflightConfirmInputClass, /rounded-lg/);
    assert.match(preflightConfirmInputClass, /py-2/);
    assert.doesNotMatch(preflightConfirmInputClass, /h-9/);
  });

  it("matches the reference secondary-destructive button", () => {
    assert.match(preflightDetailCloseButtonClass, /h-10/);
    assert.match(preflightDetailCloseButtonClass, /px-3\.5/);
    assert.match(preflightDetailCloseButtonClass, /font-semibold/);
    assert.match(preflightDetailCloseButtonClass, /ring-inset/);
    assert.match(preflightDetailCloseButtonClass, /ring-error-300/);
    assert.match(preflightDetailCloseButtonClass, /text-error-600/);
    assert.match(preflightDetailCloseButtonClass, /hover:bg-error-50/);
    assert.match(preflightDetailCloseButtonClass, /shadow-none/);
    assert.doesNotMatch(preflightDetailCloseButtonClass, /shadow-xslg/);
  });
});

describe("PreFlightCheckList", () => {
  it("renders pass and fail rows with reference spacing", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/PreFlightCheckList.tsx",
      ),
      "utf8",
    );

    assert.match(source, /preflightCheckListClass/);
    assert.match(source, /preflightCheckPassIconClass/);
    assert.match(source, /preflightCheckFailIconClass/);
    assert.match(source, /preflightCheckBlockedClass/);
  });
});

describe("ClosePreflightModalShell", () => {
  it("wraps entity and office close modals in a shared shell", () => {
    const subsidiarySource = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/CloseSubsidiaryModal.tsx",
      ),
      "utf8",
    );
    const officeSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/CloseOfficeModal.tsx",
      ),
      "utf8",
    );

    assert.match(subsidiarySource, /ClosePreflightModalShell/);
    assert.match(subsidiarySource, /PreFlightCheckList/);
    assert.match(subsidiarySource, /ConfirmNameField/);
    assert.match(officeSource, /ClosePreflightModalShell/);
    assert.match(officeSource, /PreFlightCheckList/);
    assert.doesNotMatch(officeSource, /ConfirmNameField/);
  });
});

describe("detail header close triggers", () => {
  it("uses secondary-destructive styling on entity and office headers", () => {
    const subsidiaryHeader = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/EntityDetailHeaderActions.tsx",
      ),
      "utf8",
    );
    const officeHeader = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/OfficeDetailHeader.tsx",
      ),
      "utf8",
    );

    assert.match(subsidiaryHeader, /preflightDetailCloseButtonClass/);
    assert.match(officeHeader, /preflightDetailCloseButtonClass/);
  });
});
