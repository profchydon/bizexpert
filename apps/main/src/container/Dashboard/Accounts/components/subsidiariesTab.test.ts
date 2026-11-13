import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const tabSource = readFileSync(join(dir, "SubsidiariesTab.tsx"), "utf8");
const tableSource = readFileSync(join(dir, "SubsidiaryTable.tsx"), "utf8");
const rowSource = readFileSync(join(dir, "SubsidiaryTableRow.tsx"), "utf8");
const dataSource = readFileSync(
  join(dir, "../hooks/useAccountsData.ts"),
  "utf8",
);
const listStateSource = readFileSync(
  join(dir, "../hooks/useEntitiesListState.ts"),
  "utf8",
);

describe("SubsidiariesTab", () => {
  it("loads entities from the server with pagination", () => {
    assert.match(tabSource, /useAccountsEntitiesPage/);
    assert.doesNotMatch(tabSource, /useVisibleSubsidiaries/);
    assert.match(tabSource, /ENTITIES_PAGE_SIZE/);
  });

  it("debounces search and passes filters to the entities query", () => {
    assert.match(tabSource, /useEntitiesListState/);
    assert.match(tabSource, /search: debouncedSearch/);
    assert.match(tabSource, /statuses,/);
    assert.match(listStateSource, /useDebounce/);
  });

  it("defers the empty account state until loading completes", () => {
    assert.match(tabSource, /showEmptyAccount/);
    assert.match(tabSource, /!isListLoading/);
  });
});

describe("SubsidiaryTable", () => {
  it("uses PageState loading inside the table like orders", () => {
    assert.match(tableSource, /PageState isLoading=\{isListLoading\}/);
    assert.match(tabSource, /isListLoading/);
    assert.match(
      dataSource,
      /isListLoading: query\.isLoading \|\| query\.isFetching/,
    );
    assert.doesNotMatch(tableSource, /opacity-60/);
  });
  it("requests 15 entities per page from the server", () => {
    assert.match(tabSource, /perPage: ENTITIES_PAGE_SIZE/);
    assert.match(dataSource, /ENTITIES_PAGE_SIZE/);
    assert.doesNotMatch(dataSource, /per_page: 100/);
  });

  it("uses server-driven pagination controls", () => {
    assert.match(tabSource, /totalPages=\{lastPage\}/);
    assert.match(tabSource, /onPageChange=\{setPage\}/);
    assert.match(tableSource, /currentPage=\{page\}/);
    assert.doesNotMatch(tableSource, /DEFAULT_PAGE_SIZE|\.slice\(/);
  });

  it("uses server pagination when status filters are active", () => {
    assert.match(dataSource, /statusFilterActive/);
    assert.match(dataSource, /buildEntitiesListParams/);
    assert.match(dataSource, /page,\s*\n\s*perPage,/);
    assert.doesNotMatch(dataSource, /ENTITIES_FILTER_FETCH_SIZE/);
    assert.doesNotMatch(dataSource, /filterSubsidiaries/);
    assert.doesNotMatch(dataSource, /paginateSubsidiaries/);
    assert.match(dataSource, /mergeAccountsEntities/);
    assert.match(dataSource, /searchActive/);
  });

  it("renders unmapped entity statuses as an em dash in the table", () => {
    assert.match(
      rowSource,
      /subsidiary\.status === UNMAPPED_SUBSIDIARY_STATUS/,
    );
    assert.match(rowSource, /—/);
  });
});
