import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "OfficesTab.tsx"), "utf8");
const tableSource = readFileSync(join(dir, "OfficesTable.tsx"), "utf8");

describe("OfficesTab", () => {
  it("lists offices from the server", () => {
    assert.match(source, /useOfficesPage/);
    assert.doesNotMatch(source, /useVisibleOffices|useVisibleSubsidiaries/);
  });

  it("sources wizard parents from server entities", () => {
    assert.match(source, /useOfficeParents/);
    assert.doesNotMatch(source, /toOfficeParent/);
  });

  it("keeps the subsidiary query-param filter", () => {
    assert.match(source, /get\("subsidiary"\)/);
    assert.match(source, /office\.subsidiaryId === filterId/);
  });

  it("renders the shared loader while fetching, not a skeleton", () => {
    assert.match(source, /import Loader from "@\/components\/Loader"/);
    assert.match(source, /if \(isLoading\) return <OfficesTabLoading \/>;/);
    assert.match(
      source,
      /function OfficesTabLoading\(\)[\s\S]*?<Loader \/>[\s\S]*?\n\}/,
    );
    assert.doesNotMatch(source, /animate-pulse/);
  });

  it("centers the loader in the remaining offices tab space", () => {
    const page = readFileSync(
      join(process.cwd(), "src/container/Dashboard/Accounts/AccountsPage.tsx"),
      "utf8",
    );
    const tabs = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/AccountsPageTabs.tsx",
      ),
      "utf8",
    );

    assert.match(source, /min-h-0 w-full flex-1 place-content-center/);
    assert.match(page, /min-h-\[calc\(100vh-72px\)\]/);
    assert.match(page, /mt-6 flex min-h-0 flex-1 flex-col/);
    assert.match(tabs, /flex min-h-0 flex-1 flex-col/);
    assert.match(tabs, /value="offices"[\s\S]*flex min-h-0 flex-1 flex-col/);
  });
});

describe("OfficesTable", () => {
  it("requests 15 offices per page from the server", () => {
    assert.match(source, /const OFFICES_PER_PAGE = 15;/);
    assert.match(source, /perPage: OFFICES_PER_PAGE/);
  });

  it("uses server-driven pagination controls", () => {
    assert.match(source, /totalPages=\{lastPage\}/);
    assert.match(source, /onPageChange=\{setPage\}/);
    assert.match(tableSource, /currentPage=\{page\}/);
    assert.doesNotMatch(tableSource, /DEFAULT_PAGE_SIZE|\.slice\(/);
  });
});
