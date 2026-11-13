import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  getCollectionDateSubmitDisabledReason,
  isValidCollectionStartDate,
} from "./selectReceiverDateValidation.ts";
import { buildCollectionDateOffboardingUpdate } from "./selectReceiverDateSubmit.ts";

describe("selectReceiverDateValidation", () => {
  it("requires a valid collection start date before submit", () => {
    assert.equal(isValidCollectionStartDate(undefined), false);
    assert.equal(isValidCollectionStartDate("2026-08-18"), true);
    assert.match(
      getCollectionDateSubmitDisabledReason(undefined) ?? "",
      /collection start date/i,
    );
  });
});

describe("SelectAReceiverDate slideout", () => {
  it("uses the reference SlideoutMenu shell instead of DrawerRight", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/Drawers/SelectAReceieverDate/SelectAReceiverDateSlideout.tsx",
      ),
      "utf8",
    );
    const entry = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/Drawers/SelectAReceieverDate/index.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /SlideoutMenu/);
    assert.match(slideout, /SELECT_RECEIVER_DATE_SLIDEOUT_RESIZE/);
    assert.match(slideout, /Please select collection for the device\(s\)/);
    assert.match(slideout, /Collection start date/);
    assert.match(slideout, /border-t border-secondary px-6 py-4/);
    assert.match(slideout, /DisabledWithTooltip/);
    assert.match(slideout, /popoverModal=\{false\}/);
    assert.match(slideout, /shouldCloseOnInteractOutside/);
    assert.match(slideout, /isNestedRadixOverlay/);
    assert.match(slideout, /onClick=\{onClose\}/);
    assert.match(slideout, /onClick=\{onCancel\}/);
    assert.match(entry, /SelectAReceiverDateSlideout/);
    assert.doesNotMatch(entry, /DrawerRight/);
  });
});

describe("selectReceiverDateCancel", () => {
  it("cleans up in-progress offboarding rows without owning drawer close", async () => {
    const { cancelSelectReceiverDateFlow } =
      await import("./selectReceiverDateCancel.ts");
    const dispatched: string[] = [];
    const pushCalls: string[] = [];

    cancelSelectReceiverDateFlow({
      dispatch: ((action: { payload: string }) => {
        dispatched.push(action.payload);
      }) as any,
      offboardingData: [
        { id: "eq-1", statusFlow: "In Progress" },
        { id: "eq-2", statusFlow: "Completed" },
      ] as any,
      equipID: null,
      baseRoute: "/dashboard/equipment",
      push: (path) => pushCalls.push(path),
    });

    assert.deepEqual(dispatched, ["eq-1"]);
    assert.deepEqual(pushCalls, ["/dashboard/equipment"]);
  });
});

describe("selectReceiverDateSubmit", () => {
  it("marks selected offboarding rows complete with a collection date", () => {
    const result = buildCollectionDateOffboardingUpdate({
      offboardingData: [
        { id: "eq-1", title: "Laptop", actionType: "Store" },
        { id: "eq-2", title: "Phone", actionType: "Store" },
      ] as any,
      selectDate: "2026-08-18",
      equipID: "eq-1",
      selectedRowIds: ["eq-1"],
    });

    assert.equal(Array.isArray(result), true);
    assert.equal((result as any[])[0].collectionDate, "2026-08-18");
    assert.equal((result as any[])[0].statusFlow, "Completed");
  });

  it("builds store updates from selected row ids when offboarding state is null", () => {
    const result = buildCollectionDateOffboardingUpdate({
      offboardingData: null,
      selectDate: "2026-08-18",
      equipID: null,
      selectedRowIds: ["eq-1", "eq-2"],
    });

    assert.deepEqual(result, [
      {
        id: "eq-1",
        collectionDate: "2026-08-18",
        statusFlow: "Completed",
        actionType: "Store",
      },
      {
        id: "eq-2",
        collectionDate: "2026-08-18",
        statusFlow: "Completed",
        actionType: "Store",
      },
    ]);
  });

  it("skips null entries in offboarding arrays", () => {
    const result = buildCollectionDateOffboardingUpdate({
      offboardingData: [null, { id: "eq-1", actionType: "Store" }] as any,
      selectDate: "2026-08-18",
      equipID: "eq-1",
      selectedRowIds: ["eq-1"],
    });

    assert.equal((result as any[])[0], null);
    assert.equal((result as any[])[1].collectionDate, "2026-08-18");
  });
});
