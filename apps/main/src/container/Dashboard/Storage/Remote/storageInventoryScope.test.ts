import assert from "node:assert/strict";
import { test } from "node:test";
import {
  STICKY_ACTION_CELL,
  STICKY_ACTION_HEAD,
} from "./utils/stickyActionColumn";
import { IN_STORAGE_STATUSES } from "./types/storage";

test("in-storage statuses match the reference inventory tab scope", () => {
  assert.deepEqual(IN_STORAGE_STATUSES, ["available", "pending_check"]);
});

test("inventory sticky action column uses semantic surface tokens", () => {
  assert.match(STICKY_ACTION_HEAD, /bg-secondary/);
  assert.match(STICKY_ACTION_CELL, /bg-primary/);
  assert.match(STICKY_ACTION_CELL, /group-hover:bg-secondary/);
});
