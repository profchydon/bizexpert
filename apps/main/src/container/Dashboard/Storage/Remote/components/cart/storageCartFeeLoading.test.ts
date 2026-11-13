import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage cart fee loading", () => {
  it("exposes fee loading state from the service-fees query", () => {
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageServiceFeesState.ts",
      ),
      "utf8",
    );

    assert.match(hook, /useGetServiceFeesQuery/);
    assert.doesNotMatch(hook, /useWorkspaceCompanyId/);
    assert.doesNotMatch(hook, /skipToken/);
    assert.match(hook, /isFeesLoading/);
    assert.match(hook, /isFeesReady/);
  });

  it("shows net service-fee API amounts in storage cart rows", () => {
    const section = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/CartActionsSection.tsx"),
      "utf8",
    );
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/StorageActionsCartOverview.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(section, /displayServiceAmount/);
    assert.match(section, /displayFee=\{lineFee\(item\)\}/);
    assert.match(
      section,
      /formatMoney\(subtotal\(items\), cartCurrency\(items\)\)/,
    );
    assert.doesNotMatch(overview, /displayServiceAmount/);
    assert.match(
      overview,
      /formatMoney\(displayTotal, cartCurrency\(actionItems\)\)/,
    );
  });

  it("shows skeleton placeholders while storage cart fees load", () => {
    const storageCartOverview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/StorageActionsCartOverview.tsx",
      ),
      "utf8",
    );
    const section = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/CartActionsSection.tsx"),
      "utf8",
    );

    assert.match(storageCartOverview, /StorageCartFeeSkeleton/);
    assert.match(storageCartOverview, /showFeePlaceholder/);
    assert.match(section, /CheckoutItemRowSkeleton/);
    assert.match(section, /showFeePlaceholder/);
  });
});
