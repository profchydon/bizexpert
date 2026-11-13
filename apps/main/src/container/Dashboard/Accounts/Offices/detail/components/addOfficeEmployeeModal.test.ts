import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const modalSource = readFileSync(
  join(dir, "AddOfficeEmployeeModal.tsx"),
  "utf8",
);
const hookSource = readFileSync(
  join(dir, "../../hooks/useOfficeEmployeeOptions.ts"),
  "utf8",
);

describe("useOfficeEmployeeOptions", () => {
  it("defaults the server search to the office country", () => {
    assert.match(hookSource, /search: search \|\| region/);
  });

  it("requests 15 employees per page with paging", () => {
    assert.match(hookSource, /per_page: 15/);
    assert.match(hookSource, /page \}/);
    assert.doesNotMatch(hookSource, /per_page: 100/);
  });

  it("appends pages and reports when more pages exist", () => {
    assert.match(hookSource, /syncOpenPagedRows/);
    assert.match(hookSource, /currentPage < lastPage/);
  });

  it("rehydrates cached employees when the modal opens again", () => {
    assert.match(hookSource, /\[data, isOpen\]/);
    assert.doesNotMatch(hookSource, /setRows\(\[\]\)/);
  });
});

describe("AddOfficeEmployeeModal", () => {
  it("keeps the country guard on rendered options", () => {
    assert.match(modalSource, /employee\.country === office\.region/);
  });

  it("assigns employees under the office's own entity", () => {
    assert.match(modalSource, /companyId: office\.subsidiaryId/);
  });

  it("wires load-more paging into the picker", () => {
    assert.match(modalSource, /hasMore=\{hasMore\}/);
    assert.match(modalSource, /onLoadMore=\{loadMore\}/);
    assert.match(modalSource, /isLoadingMore=\{isFetching\}/);
  });

  it("does not close when the overlay is clicked", () => {
    assert.match(
      modalSource,
      /onInteractOutside=\{\(event\) => event\.preventDefault\(\)\}/,
    );
    assert.match(
      modalSource,
      /onPointerDownOutside=\{\(event\) => event\.preventDefault\(\)\}/,
    );
  });
});
