import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("Storage navigation loading", () => {
  it("scopes import loading to the empty-state button", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/StoragePage.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /onImport\("import-empty"\)/);
    assert.match(source, /isViewLoading\("import-empty"\)/);
    assert.doesNotMatch(source, /onImport\("import-header"\)/);
  });

  it("shows button loading while routing from the import flow", () => {
    const importPage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/import/ImportPage.tsx",
      ),
      "utf8",
    );
    const importSuccess = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/import/components/ImportSuccess.tsx",
      ),
      "utf8",
    );
    const receiptReport = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/import/components/ReceiptReport.tsx",
      ),
      "utf8",
    );
    const importWizard = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/import/components/ImportWizard.tsx",
      ),
      "utf8",
    );

    assert.match(importPage, /isViewLoading\("storage"\)/);
    assert.match(importPage, /isViewLoading\("receipt"\)/);
    assert.match(importPage, /disabled=\{isPending\}/);
    assert.match(importSuccess, /isLoading=\{isReceiptLoading\}/);
    assert.match(importSuccess, /isLoading=\{isBackLoading\}/);
    assert.match(receiptReport, /isLoading=\{isBackLoading\}/);
    assert.match(
      importWizard,
      /isLoading=\{w\.step === 0 \? isCancelLoading : false\}/,
    );
  });
});
