import assert from "node:assert/strict";
import test from "node:test";
import { buildCancelConsequence, modalTitle } from "./buildCancelConsequence";
import type { CancelScope } from "./buildCancelScope";

const emptyScope: CancelScope = {
  people: [],
  total: 0,
  spent: 0,
  exclusion: { devices: 0, excludedDevices: 0, basis: "hardware" },
};

test("modalTitle falls back to order wording when sub-order scope has no people", () => {
  const title = modalTitle({
    intent: { type: "sub-orders", employeeIds: ["emp-1"] },
    cancellationScope: { kind: "sub-orders", employeeIds: ["emp-1"] },
    scope: emptyScope,
    orderId: "RE-ONB-D1DCF-2026",
  });

  assert.equal(
    title,
    "Are you sure you want to cancel order RE-ONB-D1DCF-2026?",
  );
});

test("modalTitle names a single sub-order when scope has one person", () => {
  const title = modalTitle({
    intent: { type: "sub-orders", employeeIds: ["sub-1"] },
    cancellationScope: { kind: "sub-orders", employeeIds: ["sub-1"] },
    scope: {
      ...emptyScope,
      people: [
        {
          id: "sub-1",
          name: "Alex Chen",
          meta: "1 device",
          amount: 100,
          devices: [],
          charges: [],
          spent: 0,
        },
      ],
    },
    orderId: "RE-ONB-D1DCF-2026",
  });

  assert.equal(title, "Cancel Alex Chen's sub-order?");
});

test("buildCancelConsequence does not quote a refund amount before admin review", () => {
  const consequence = buildCancelConsequence({
    scope: {
      ...emptyScope,
      people: [
        {
          id: "sub-1",
          name: "Alex Chen",
          meta: "1 device",
          amount: 100,
          devices: [],
          charges: [],
          spent: 0,
        },
      ],
      exclusion: { devices: 1, excludedDevices: 0, basis: "hardware" },
    },
    cancellationScope: { kind: "full" },
    preview: {
      headline: "USD 2,883.05",
      destination: "credited back to your card",
      unpaid: false,
      rows: [],
    },
    orderId: "RE-ONB-001",
    isPreAccept: false,
  });

  assert.match(consequence.points[1], /may not be the full amount paid/);
  assert.doesNotMatch(consequence.points[1], /2,883\.05/);
});
