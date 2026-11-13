import assert from "node:assert/strict";
import test from "node:test";

import { OrderActivity } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";
import { parseOrderActivitiesResponse } from "./parseOrderActivitiesResponse";

test("parseOrderActivitiesResponse reads nested activities and pagination meta", () => {
  const activity = { id: "act-1" } as OrderActivity;
  const parsed = parseOrderActivitiesResponse({
    success: true,
    message: "ok",
    data: {
      data: {
        activities: [activity],
      },
      current_page: 2,
      last_page: 5,
      total: 42,
    },
  });

  assert.deepEqual(parsed.activities, [activity]);
  assert.equal(parsed.currentPage, 2);
  assert.equal(parsed.lastPage, 5);
  assert.equal(parsed.total, 42);
});

test("parseOrderActivitiesResponse falls back when pagination meta is missing", () => {
  const parsed = parseOrderActivitiesResponse(undefined, 3);
  assert.deepEqual(parsed.activities, []);
  assert.equal(parsed.currentPage, 3);
  assert.equal(parsed.lastPage, 1);
  assert.equal(parsed.total, 0);
});
