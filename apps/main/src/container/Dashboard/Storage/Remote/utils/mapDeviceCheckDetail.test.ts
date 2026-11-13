import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IInStorageEquipmentDetailCheck } from "@/types/equipmentsInStorageInventory";
import type { StoredDevice } from "../types/storage";
import { mapDeviceCheckDetail } from "./mapDeviceCheckDetail";

const device: StoredDevice = {
  id: "eq-1",
  deviceName: "MacBook Pro 14",
  model: "MacBook Pro 14",
  deviceType: "Laptop",
  assetType: "Laptop/Workstation",
  serialNumber: "C02G9LASH4PT",
  country: "Nigeria",
  warehouse: "Nigeria",
  entrySource: "offboarding",
  entryDate: "2026-03-12",
  status: "available",
  currency: "USD",
  grade: "A",
  lastCheckDate: "2026-05-21",
};

const completedCheck: IInStorageEquipmentDetailCheck = {
  mode: "vendor",
  status: "completed",
  overall_grade: "A",
  grade_label: "Excellent",
  subtitle: null,
  note: "Like-new.",
  checked_at: "2026-05-21",
  checked_days_ago: 11,
  summary: { powers_on: true, serial_verified: true },
  condition_by_component: [{ label: "Screen", rating: "Excellent" }],
  accessories_included: [{ name: "Charger / power adapter", present: true }],
  photos: ["/devices/checks/laptop/1.jpg"],
};

describe("mapDeviceCheckDetail", () => {
  it("maps buy-to-storage not_required as a new sealed device", () => {
    const state = mapDeviceCheckDetail(
      {
        ...completedCheck,
        status: "not_required",
        subtitle: "Brand new · factory sealed",
        note: "Purchased new into storage — graded A, no inspection needed",
        condition_by_component: [],
        accessories_included: [],
        photos: [],
      },
      device,
    );

    assert.equal(state.kind, "new");
    if (state.kind === "new") {
      assert.equal(state.subtitle, "Brand new · factory sealed");
    }
  });

  it("keeps a prior report when a re-check is pending", () => {
    const state = mapDeviceCheckDetail(
      { ...completedCheck, status: "pending" },
      { ...device, status: "pending_check" },
    );

    assert.equal(state.kind, "report");
    if (state.kind === "report") {
      assert.equal(state.pendingRecheck, true);
      assert.equal(state.report.grade, "A");
      assert.equal(state.report.condition[0]?.label, "Screen");
    }
  });

  it("shows awaiting only when a pending check has no prior report", () => {
    const state = mapDeviceCheckDetail(
      {
        ...completedCheck,
        status: "pending",
        overall_grade: null,
        checked_at: null,
        summary: null,
        condition_by_component: [],
        accessories_included: [],
        photos: [],
      },
      {
        ...device,
        status: "pending_check",
        grade: undefined,
        lastCheckDate: undefined,
      },
    );

    assert.equal(state.kind, "awaiting");
  });

  it("maps submitted API reports that use condition and photo objects", () => {
    const state = mapDeviceCheckDetail(
      {
        ...completedCheck,
        status: "submitted",
        note: null,
        summary: null,
        condition_by_component: [
          { component: "Screen", condition: "Good" },
          { component: "Keyboard", condition: "Not applicable" },
        ],
        photos: [
          {
            id: "photo-1",
            url: "https://assets.rayda.co/test/check.jpg",
          },
        ],
      },
      device,
    );

    assert.equal(state.kind, "report");
    if (state.kind === "report") {
      assert.deepEqual(state.report.condition, [
        { label: "Screen", rating: "Good" },
      ]);
      assert.deepEqual(state.report.photos, [
        "https://assets.rayda.co/test/check.jpg",
      ]);
    }
  });

  it("uses the inventory grade when a pending check omits report fields", () => {
    const state = mapDeviceCheckDetail(
      {
        ...completedCheck,
        status: "pending",
        overall_grade: null,
        condition_by_component: [],
        photos: [],
        checked_at: null,
      },
      { ...device, status: "pending_check" },
    );

    assert.equal(state.kind, "report");
    if (state.kind === "report") {
      assert.equal(state.pendingRecheck, true);
      assert.equal(state.report.grade, "A");
    }
  });
});
