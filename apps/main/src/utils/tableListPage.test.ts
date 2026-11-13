import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  listReturnHref,
  parseTablePage,
  withListLocation,
} from "./tableListPage";

describe("parseTablePage", () => {
  it("keeps positive integers and falls back otherwise", () => {
    assert.equal(parseTablePage("2"), 2);
    assert.equal(parseTablePage("1"), 1);
    assert.equal(parseTablePage(null), 1);
    assert.equal(parseTablePage("0"), 1);
    assert.equal(parseTablePage("nope"), 1);
  });
});

describe("withListLocation", () => {
  it("adds the list page and tab without dropping existing query params", () => {
    assert.equal(
      withListLocation(
        "/dashboard/accounts/offices/office-1?entityId=entity-9",
        {
          page: 2,
          tab: "offices",
          pageKey: "offices_page",
        },
      ),
      "/dashboard/accounts/offices/office-1?entityId=entity-9&list_page=2&list_tab=offices&list_page_key=offices_page",
    );
  });

  it("leaves the first page off the detail link", () => {
    assert.equal(
      withListLocation("/dashboard/employees/employee-1", { page: 1 }),
      "/dashboard/employees/employee-1",
    );
  });

  it("carries list filters onto the detail link", () => {
    assert.equal(
      withListLocation("/dashboard/orders/order-1?entity=entity-ng", {
        page: 3,
        query: { status: "completed", type: "" },
      }),
      "/dashboard/orders/order-1?entity=entity-ng&list_page=3&list_status=completed",
    );
  });
});

describe("listReturnHref", () => {
  it("restores the list page and tab from a detail link", () => {
    const search = new URLSearchParams(
      "list_page=2&list_tab=offices&list_page_key=offices_page",
    );
    assert.equal(
      listReturnHref("/dashboard/accounts", search),
      "/dashboard/accounts?tab=offices&offices_page=2",
    );
  });

  it("keeps the fallback when the detail link has no list location", () => {
    assert.equal(
      listReturnHref("/dashboard/orders", new URLSearchParams()),
      "/dashboard/orders",
    );
  });

  it("restores the filtered orders page", () => {
    const search = new URLSearchParams(
      "entity=entity-ng&list_page=3&list_status=completed",
    );
    assert.equal(
      listReturnHref("/dashboard/orders", search),
      "/dashboard/orders?page=3&status=completed&entity=entity-ng",
    );
  });

  it("restores a filtered first page", () => {
    const search = new URLSearchParams("list_status=completed");
    assert.equal(
      listReturnHref("/dashboard/orders", search),
      "/dashboard/orders?status=completed",
    );
  });
});
