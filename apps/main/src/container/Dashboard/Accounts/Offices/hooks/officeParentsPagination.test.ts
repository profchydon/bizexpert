import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { mergeEntityPages } from "../../utils/mergeEntityPages.ts";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const ACCOUNTS = "src/container/Dashboard/Accounts";

const entity = (id: string) =>
  ({ id, name: `Entity ${id}` }) as EntityApiRecord;

describe("mergeEntityPages", () => {
  it("replaces the list on the first page", () => {
    const first = [entity("a"), entity("b")];
    assert.deepEqual(mergeEntityPages([entity("stale")], first, 1), first);
  });

  it("appends later pages onto what is already loaded", () => {
    const merged = mergeEntityPages([entity("a")], [entity("b")], 2);
    assert.deepEqual(
      merged.map((row) => row.id),
      ["a", "b"],
    );
  });

  it("drops duplicates so a refetched page cannot double up", () => {
    const merged = mergeEntityPages(
      [entity("a"), entity("b")],
      [entity("b"), entity("c")],
      2,
    );
    assert.deepEqual(
      merged.map((row) => row.id),
      ["a", "b", "c"],
    );
  });

  it("handles an empty incoming page", () => {
    assert.deepEqual(mergeEntityPages([entity("a")], [], 2), [entity("a")]);
  });
});

describe("useOfficeParents pagination", () => {
  const hook = read(`${ACCOUNTS}/Offices/hooks/useOfficeParents.ts`);

  it("requests one page at a time and accumulates them", () => {
    assert.match(hook, /page,\s*\n\s*per_page: ENTITIES_PAGE_SIZE,/);
    assert.match(
      hook,
      /setEntities\(\(current\) => mergeEntityPages\(current, payload\.data, page\)\)/,
    );
  });

  it("exposes whether more pages remain", () => {
    assert.match(hook, /const lastPage = payload\?\.last_page \?\? 1/);
    assert.match(hook, /const hasMore = page < lastPage/);
  });

  it("guards load more against a page beyond the last or an in-flight fetch", () => {
    assert.match(hook, /if \(!hasMore \|\| query\.isFetching\) return/);
    assert.match(hook, /setPage\(\(current\) => current \+ 1\)/);
  });

  it("resets when the company changes", () => {
    assert.match(hook, /setPage\(1\);\s*\n\s*setEntities\(\[\]\);/);
  });

  it("still hides closed entities", () => {
    assert.match(hook, /entity\.lifecycle_status !== "closed"/);
  });

  it("lists entities from the primary company, not the active subsidiary", () => {
    assert.match(hook, /useEntitiesListCompanyId/);
  });
});

describe("useOfficeParents search", () => {
  const hook = read(`${ACCOUNTS}/Offices/hooks/useOfficeParents.ts`);

  it("debounces the term before querying", () => {
    assert.match(hook, /useDebounce\(search\.trim\(\), 400\)/);
  });

  it("sends the term to the server rather than filtering loaded pages", () => {
    assert.match(
      hook,
      /\.\.\.\(debouncedSearch \? \{ search: debouncedSearch \} : \{\}\)/,
    );
  });

  it("restarts pagination when the term changes", () => {
    assert.match(hook, /\}, \[companyId, debouncedSearch\]\)/);
  });
});

describe("parent entity picker load more", () => {
  const field = read(`${ACCOUNTS}/components/wizard/WizardSelectField.tsx`);
  const step = read(`${ACCOUNTS}/Offices/wizard/StepOfficeDetails.tsx`);
  const tab = read(`${ACCOUNTS}/Offices/components/OfficesTab.tsx`);

  it("renders a load more button in the dropdown only when more remain", () => {
    assert.match(field, /hasMore && onLoadMore &&/);
    assert.match(field, /isLoadingMore \? "Loading\.\.\." : "Load more"/);
    assert.match(field, /disabled=\{isLoadingMore\}/);
  });

  it("caps the dropdown height and scrolls the options", () => {
    assert.match(field, /overflow-y-auto/);
    assert.match(field, /overscroll-contain/);
    assert.match(
      field,
      /max-h-\[min\(20rem,var\(--radix-select-content-available-height\)\)\]/,
    );
  });

  it("keeps the search box pinned while only the list scrolls", () => {
    assert.match(field, /flex flex-col overflow-hidden/);
    assert.match(field, /className="shrink-0 border-b border-gray-100 p-1\.5"/);
    assert.match(
      field,
      /min-h-0 min-w-\[var\(--radix-select-trigger-width\)\] flex-1/,
    );
  });

  it("keeps the select from swallowing the button's interaction", () => {
    assert.match(
      field,
      /onPointerDown=\{\(event\) => event\.stopPropagation\(\)\}/,
    );
    assert.match(
      field,
      /onKeyDown=\{\(event\) => event\.stopPropagation\(\)\}/,
    );
  });

  it("wires the parent entity field to the paginated hook", () => {
    assert.match(step, /hasMore=\{hasMoreParents\}/);
    assert.match(step, /onLoadMore=\{onLoadMoreParents\}/);
    assert.match(tab, /onLoadMoreParents=\{loadMore\}/);
    assert.match(tab, /hasMoreParents=\{hasMore\}/);
  });

  it("renders a search box that feeds the query", () => {
    assert.match(field, /onSearchChange && \(/);
    assert.match(
      field,
      /onChange=\{\(event\) => onSearchChange\(event\.target\.value\)\}/,
    );
    assert.match(step, /searchPlaceholder="Search entities"/);
    assert.match(tab, /useOfficeParents\(parentSearch\)/);
    assert.match(tab, /onParentSearchChange=\{setParentSearch\}/);
  });

  it("tells the user when a search matches nothing", () => {
    assert.match(field, /options\.length === 0 && \(/);
    assert.match(field, /\{emptyMessage\}/);
    assert.match(step, /emptyMessage="No entities found"/);
  });
});
