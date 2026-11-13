import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ISubOrder } from "@/types/orders";
import { buildSlideoutData, relatedOffboardingSubOrders } from "./slideoutData";

describe("buildSlideoutData", () => {
  it("normalizes an onboarding sub-order from assets", () => {
    const sub = {
      employee_first_name: "Emily",
      employee_last_name: "Clarke",
      address: "44 Brick Lane",
      total_amount: "39500",
      assets: [
        {
          id: "a1",
          name: "MacBook",
          make: "Apple",
          model: "M3",
          signature_requested: true,
        },
      ],
    } as unknown as ISubOrder;
    const data = buildSlideoutData(sub, "onboarding", "£");
    assert.equal(data.name, "Emily Clarke");
    assert.equal(data.amount, "£39,500.00");
    assert.equal(data.signatureRequested, true);
    assert.equal(data.items.length, 1);
    assert.equal(data.progressLabel, "Verification progress");
    assert.equal(data.isOffboarding, false);
  });

  it("uses party + equipment data for off-boarding reassignment", () => {
    const sub = {
      type: "reassign",
      address: "",
      amount: "624",
      signature_requested: false,
      order_details: {
        from: { first_name: "Bola", last_name: "A", address: "12 Pickup Rd" },
        to: {
          id: "to-1",
          first_name: "Ada",
          last_name: "N",
          email: "ada@x.com",
          address: "9 Dropoff Ave",
        },
      },
      equipment: { id: "e1", title: "Dell XPS", make: "Dell" },
    } as unknown as ISubOrder;
    const data = buildSlideoutData(sub, "offboarding", "£");
    assert.equal(data.name, "Bola A");
    assert.equal(data.address, "12 Pickup Rd");
    assert.equal(data.progressLabel, "Retrieval progress");
    assert.equal(data.isReassignment, true);
    assert.equal(data.signatureEmployeeId, "to-1");
    assert.equal(data.items[0].label, "Dell XPS Dell");
    assert.equal(data.recipient?.name, "Ada N");
    assert.equal(data.recipient?.address, "9 Dropoff Ave");
  });

  it("keeps every asset when they share an id", () => {
    const first = { id: "spec-1", name: "MacBook Pro", make: "Apple" };
    const second = { id: "spec-1", name: "MacBook Pro", make: "Apple" };
    const sub = { assets: [first, second] } as unknown as ISubOrder;
    const data = buildSlideoutData(sub, "onboarding", "£");
    assert.equal(data.items.length, 2);
    assert.equal(data.items[0].asset, first);
    assert.equal(data.items[1].asset, second);
  });

  it("drops placeholder make/model parts from the item label", () => {
    const sub = {
      assets: [
        {
          id: "a1",
          name: "BenQ 2X GW2485TC Monitor",
          make: "Not Applicable",
          model: "N/A",
        },
      ],
    } as unknown as ISubOrder;
    const data = buildSlideoutData(sub, "onboarding", "£");
    assert.equal(data.items[0].label, "BenQ 2X GW2485TC Monitor");
  });

  it("omits the recipient for non-reassign instances", () => {
    const sub = {
      type: "storage",
      equipment: { assignee: { id: "as-1", name: "Nolan" } },
    } as unknown as ISubOrder;
    assert.equal(
      buildSlideoutData(sub, "offboarding", "£").recipient,
      undefined,
    );
  });

  it("locks the window help/note for committed statuses", () => {
    const locked = buildSlideoutData(
      { type: "reassign", status: "in_progress" } as unknown as ISubOrder,
      "offboarding",
      "£",
    );
    assert.equal(locked.windowLocked, true);
    assert.match(locked.windowHelp, /Rayda collects the devices/);
    assert.match(locked.windowLockedNote, /A vendor accepted this pickup/);

    const open = buildSlideoutData(
      { type: "reassign", status: "pending" } as unknown as ISubOrder,
      "offboarding",
      "£",
    );
    assert.equal(open.windowLocked, false);
  });

  it("maps tracking fields from the sub-order", () => {
    const data = buildSlideoutData(
      {
        tracking_no: "OFF-EVQSE26",
        external_tracking_link: "https://track.dhl.com/123",
        courier_name: "DHL",
      } as unknown as ISubOrder,
      "offboarding",
      "£",
    );
    assert.equal(data.trackingNo, "OFF-EVQSE26");
    assert.equal(data.externalTrackingLink, "https://track.dhl.com/123");
    assert.equal(data.courierName, "DHL");
  });

  it("resolves the storage assignee for signature", () => {
    const sub = {
      type: "storage",
      equipment: { assignee: { id: "as-1", name: "Nolan", address: "9 St" } },
    } as unknown as ISubOrder;
    const data = buildSlideoutData(sub, "offboarding", "£");
    assert.equal(data.signatureEmployeeId, "as-1");
    assert.equal(data.isStorageAction, true);
    assert.equal(data.address, "9 St");
  });

  it("aggregates offboarding devices for the same employee", () => {
    const order = {
      type: "offboarding",
      sub_orders: [
        {
          id: "sub-1",
          user_id: "user-1",
          total_amount: 154.15,
          equipment: { id: "eq-1", title: "MacBook Pro", make: "Apple" },
        },
        {
          id: "sub-2",
          user_id: "user-1",
          total_amount: 154.15,
          equipment: { id: "eq-2", title: "HP Zbook", make: "HP" },
        },
      ],
    };
    const related = relatedOffboardingSubOrders(
      order,
      order.sub_orders[0] as unknown as ISubOrder,
    );
    assert.equal(related.length, 2);

    const data = buildSlideoutData(
      order.sub_orders[0] as unknown as ISubOrder,
      "offboarding",
      "£",
      related as unknown as ISubOrder[],
    );
    assert.equal(data.items.length, 2);
    assert.equal(data.amount, "£308.30");
  });
});
