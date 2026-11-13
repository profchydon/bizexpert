import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { OrderActivity } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";
import {
  collapseDuplicateCancelledActivities,
  isStaleCancelledOrderActivity,
} from "./mapOrderActivity";

const dir = join(
  process.cwd(),
  "src/container/Dashboard/Orders/ViewOrder/OrderUpdates",
);

const cancelledActivity = {
  title: { text: "Order status updated" },
  status: "cancelled",
} as OrderActivity;

describe("Order updates activity mapping", () => {
  it("defines mapActivityToFeedItem once in mapOrderActivity", () => {
    const index = readFileSync(join(dir, "index.tsx"), "utf8");
    const mapper = readFileSync(join(dir, "mapOrderActivity.ts"), "utf8");

    assert.match(index, /from "\.\/mapOrderActivity"/);
    assert.doesNotMatch(index, /const mapActivityToFeedItem/);
    assert.match(mapper, /export function mapActivityToFeedItem/);
  });

  it("hides cancelled order-status lines on a completed order", () => {
    assert.equal(
      isStaleCancelledOrderActivity(cancelledActivity, "completed"),
      true,
    );
    assert.equal(
      isStaleCancelledOrderActivity(cancelledActivity, "cancelled"),
      false,
    );
  });

  it("keeps a single cancelled status line when two were logged", () => {
    const collapsed = collapseDuplicateCancelledActivities([
      { ...cancelledActivity, id: "a" },
      { ...cancelledActivity, id: "b" },
    ] as OrderActivity[]);
    assert.equal(collapsed.length, 1);
  });
});
