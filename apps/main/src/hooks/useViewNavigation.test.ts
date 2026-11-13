import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("NavigateButton", () => {
  it("uses view navigation with button loading state", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/NavigateButton.tsx"),
      "utf8",
    );

    assert.match(source, /useViewNavigation/);
    assert.match(source, /isLoading=\{isLoading \|\| isPending\}/);
  });
});

describe("NavigatePressable", () => {
  it("uses scoped view navigation with disabled loading state", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/NavigatePressable.tsx"),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /isViewLoading\(scopeKey\)/);
    assert.match(source, /disabled=\{loading\}/);
  });
});

describe("ViewNavigateButton", () => {
  it("delegates to NavigateButton with link styling", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/ViewNavigateButton.tsx"),
      "utf8",
    );

    assert.match(source, /NavigateButton/);
    assert.match(source, /variant="link"/);
  });
});

describe("useViewNavigation", () => {
  it("wraps useTransitionRouter push and replace", () => {
    const source = readFileSync(
      join(process.cwd(), "src/hooks/useViewNavigation.ts"),
      "utf8",
    );

    assert.match(source, /useTransitionRouter/);
    assert.match(source, /activeKeyRef/);
    assert.match(source, /isViewLoading/);
  });
});

describe("SubsidiaryRowActions", () => {
  it("uses ViewNavigateButton for entity detail navigation", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryRowActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /ViewNavigateButton/);
  });
});

describe("OrderTableActions", () => {
  it("shows pending state on the menu trigger while navigating", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/OrderTable/OrderTableActions.tsx"),
      "utf8",
    );

    assert.match(source, /useViewNavigation/);
    assert.match(source, /isLoading=\{isPending\}/);
  });
});

describe("EmployeeOrderRowActions", () => {
  it("uses a scoped View link instead of a dots menu", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/tables/EmployeeOrderRowActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /color="link-color"/);
    assert.match(source, />\s*View\s*</);
    assert.doesNotMatch(source, /Dropdown/);
  });
});

describe("TransactionActionButton", () => {
  it("uses scoped view navigation for View and payment_link for Retry", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/components/TransactionActionButton.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /viewHref/);
    assert.match(source, /paymentLink/);
    assert.match(source, /Retrying/);
  });
});

describe("OrderDetailHeaderV2", () => {
  it("uses Button for View transaction", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/v2/OrderDetailHeaderV2.tsx",
      ),
      "utf8",
    );

    assert.match(source, /router\.push/);
  });
});

describe("OrderRowActionsV2", () => {
  it("uses scoped navigation for menu actions", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/v2/components/OrderRowActionsV2.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /View transaction/);
  });
});

describe("OrderNumberNavigateButton", () => {
  it("shows scoped loading on order ID links", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/v2/components/OrderNumberNavigateButton.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /isViewLoading\(orderId\)/);
  });
});

describe("TransactionAssociatedOrdersCard", () => {
  it("uses shared scoped navigation for associated order rows", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionAssociatedOrdersCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /useScopedViewNavigation/);
    assert.match(source, /isViewLoading={isViewLoading}/);
    assert.match(source, /aria-busy=\{loading\}/);
    assert.doesNotMatch(source, /useRouter/);
  });
});
