import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import {
  mapStorageActionKind,
  resolveOrderSummaryFlow,
  trackOrderSubmitted,
  trackStorageActionQueued,
  uniqueStorageActionKind,
} from "./orderFlowAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

describe("storage-actions order flow", () => {
  it("resolves storage-actions ahead of buy_to_storage and onboarding", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: false,
        isEquipEmployeeFlow: false,
        isStorageActionsFlow: true,
        isStorageOnlyFlow: true,
      }),
      "storage-actions",
    );
  });

  it("still defaults to onboarding when no storage-actions flag is set", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: false,
        isEquipEmployeeFlow: false,
        isStorageOnlyFlow: false,
      }),
      "onboarding",
    );
  });

  it("maps queue and fee-order kinds to deploy/dispose/check", () => {
    assert.equal(mapStorageActionKind("deployment"), "deploy");
    assert.equal(mapStorageActionKind("disposal"), "dispose");
    assert.equal(mapStorageActionKind("device_check"), "check");
    assert.equal(mapStorageActionKind("storage_deploy_to_employee"), "deploy");
    assert.equal(mapStorageActionKind("storage_disposal"), "dispose");
    assert.equal(mapStorageActionKind("storage_device_check"), "check");
    assert.equal(mapStorageActionKind("unknown"), undefined);
  });

  it("returns a unique action kind and omits mixed carts", () => {
    assert.equal(
      uniqueStorageActionKind(["deployment", "deployment"]),
      "deploy",
    );
    assert.equal(
      uniqueStorageActionKind(["deployment", "disposal"]),
      undefined,
    );
  });
});

describe("storage-actions analytics events", () => {
  const captured: Array<{
    event: string;
    properties?: Record<string, unknown>;
  }> = [];

  afterEach(() => {
    captured.length = 0;
    resetAnalyticsClientForTests();
  });

  function mockClient() {
    setAnalyticsClientForTests({
      identify: () => {},
      group: () => {},
      reset: () => {},
      capture: (event, properties) =>
        captured.push({
          event,
          properties: properties as Record<string, unknown> | undefined,
        }),
      opt_out_capturing: () => {},
      opt_in_capturing: () => {},
      has_opted_out_capturing: () => false,
    });
  }

  it("tracks storage action queued with action_kind when unique", () => {
    mockClient();
    trackStorageActionQueued("check");
    assert.equal(captured[0]?.event, "Storage Action Queued");
    assert.deepEqual(captured[0]?.properties, { action_kind: "check" });
  });

  it("omits action_kind when the queued cart has no unique kind", () => {
    mockClient();
    trackStorageActionQueued(undefined);
    assert.equal(captured[0]?.event, "Storage Action Queued");
    assert.equal(captured[0]?.properties, undefined);
  });

  it("tracks order submitted for storage-actions with action_kind", () => {
    mockClient();
    trackOrderSubmitted({
      order_flow: "storage-actions",
      order_id: "order-1",
      item_count: 2,
      total_value: 80,
      payment_method: "Card",
      action_kind: "deploy",
    });
    assert.equal(captured[0]?.event, "Order Submitted");
    assert.deepEqual(captured[0]?.properties, {
      order_flow: "storage-actions",
      order_id: "order-1",
      item_count: 2,
      total_value: 80,
      payment_method: "Card",
      action_kind: "deploy",
    });
  });
});

describe("storage-actions call sites", () => {
  const payment = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryPayment.ts",
    ),
    "utf8",
  );
  const summary = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryUpdated.tsx",
    ),
    "utf8",
  );
  const queue = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Storage/Remote/utils/queueStorageCartAction.ts",
    ),
    "utf8",
  );

  it("emits Order Submitted on the storage-actions confirm path", () => {
    assert.match(payment, /emitOrderSubmitted\("storage-actions", res\)/);
  });

  it("passes storage-actions into resolveOrderSummaryFlow", () => {
    assert.match(summary, /isStorageActionsFlow,/);
    assert.match(summary, /order_flow: "storage-actions"/);
    assert.match(summary, /step_abandoned: "order_summary"/);
  });

  it("queues the start-of-funnel event after a successful cart POST", () => {
    assert.match(queue, /trackStorageActionQueued/);
    assert.match(queue, /await addCartActions\(items\)/);
  });
});
