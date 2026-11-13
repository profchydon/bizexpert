import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const associatedOrdersSource = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionAssociatedOrdersCard.tsx",
  ),
  "utf8",
);

describe("TransactionAssociatedOrdersCard", () => {
  it("navigates rows through scoped view navigation instead of router.push", () => {
    assert.match(associatedOrdersSource, /useScopedViewNavigation/);
    assert.match(associatedOrdersSource, /<AssociatedOrderRow/);
    assert.match(associatedOrdersSource, /view\(href, scopeKey\)/);
    assert.doesNotMatch(associatedOrdersSource, /router\.push/);
  });
});
