import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const modalSource = readFileSync(join(dir, "AddOfficeAssetModal.tsx"), "utf8");
const hookSource = readFileSync(
  join(dir, "../../hooks/useOfficeAssetOptions.ts"),
  "utf8",
);

describe("useOfficeAssetOptions", () => {
  it("requests 15 devices per page with server-side search and paging", () => {
    assert.match(hookSource, /per_page: 15/);
    assert.match(hookSource, /search: search \|\| undefined/);
    assert.match(hookSource, /page,\s*\n/);
    assert.doesNotMatch(hookSource, /per_page: 100/);
  });

  it("only fetches unassigned and awaiting-assignment devices", () => {
    assert.match(
      hookSource,
      /ADDABLE_OFFICE_ASSET_STATUSES = "unassigned,awaiting_assignment"/,
    );
    assert.match(hookSource, /status: ADDABLE_OFFICE_ASSET_STATUSES/);
  });

  it("appends pages and reports when more pages exist", () => {
    assert.match(hookSource, /syncOpenPagedRows/);
    assert.match(hookSource, /currentPage < lastPage/);
  });

  it("rehydrates cached assets when the modal opens again", () => {
    assert.match(hookSource, /\[data, isOpen\]/);
    assert.doesNotMatch(hookSource, /setRows\(\[\]\)/);
  });
});

describe("AddOfficeAssetModal", () => {
  it("filters picker rows with isOfficeAddableAsset", () => {
    assert.match(modalSource, /isOfficeAddableAsset\(/);
  });

  it("assigns assets under the office's own entity", () => {
    assert.match(modalSource, /companyId: office\.subsidiaryId/);
  });

  it("lists only devices that belong to the office entity", () => {
    assert.match(hookSource, /companyId: subsidiaryId as string/);
    assert.doesNotMatch(hookSource, /subsidiary_id: subsidiaryId/);
    assert.match(hookSource, /skip: !isOpen \|\| !subsidiaryId/);
    assert.match(
      modalSource,
      /useOfficeAssetOptions\(isOpen, office\.subsidiaryId\)/,
    );
  });

  it("wires load-more paging into the picker", () => {
    assert.match(modalSource, /hasMore=\{hasMore\}/);
    assert.match(modalSource, /onLoadMore=\{loadMore\}/);
    assert.match(modalSource, /isLoadingMore=\{isFetching\}/);
  });
});
