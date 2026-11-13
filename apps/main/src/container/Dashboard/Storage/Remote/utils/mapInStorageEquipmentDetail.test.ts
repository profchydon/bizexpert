import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { IInStorageEquipmentDetail } from "@/types/equipmentsInStorageInventory";
import { mapInStorageEquipmentDetail } from "./mapInStorageEquipmentDetail";

const sample: IInStorageEquipmentDetail = {
  id: "019f8bac-4110-70dc-82c8-84fe66b8e553",
  title: "Apple MacBook Pro M2",
  asset_type: "Laptop/Workstation",
  serial_number: "HKAJSH",
  image_url: null,
  country: {
    id: "88730c2b-90a9-47e3-bd11-03b1fc414d7d",
    name: "United States",
    code: "US",
  },
  entity: {
    id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
    name: "Intensa",
  },
  source: "buy_to_storage",
  source_label: "Buy to Storage",
  storage_status: "in_storage",
  storage_status_label: "In storage",
  needs_action: false,
  grade: {
    grade: "A",
    label: "Excellent",
    checked_at: null,
    checked_days_ago: null,
    synthetic: true,
  },
  wipe_status: null,
  entry_date: "2026-07-30",
  days_in_storage: 17,
  specs: {
    display: "16.2-inch Liquid Retina XDR Display",
    memory: "16GB Unified Memory",
    storage: "512GB SSD",
    processor: "M2 Pro Chip",
  },
  tracking: {
    status: "in_storage",
    status_label: "In storage",
    location: {
      id: "88730c2b-90a9-47e3-bd11-03b1fc414d7d",
      name: "United States",
      code: "US",
    },
    source: "buy_to_storage",
    source_label: "Buy to Storage",
    wipe_status: null,
    source_order: {
      id: "019f8bac-4104-7182-8d53-e09ad1b48c58",
      order_number: "RE-BTS-B1145-2026",
    },
    storage_intake_date: "2026-07-30",
    days_in_storage: 17,
    lifecycle: [
      {
        event: "entered_storage",
        label: "Entered storage",
        description: "Buy to Storage at United States",
        occurred_at: "2026-07-30T14:22:56+01:00",
      },
    ],
  },
  details: {
    product_type: "Laptop/Workstation",
    serial_number: "HKAJSH",
    specifications: {
      display: "16.2-inch Liquid Retina XDR Display",
      memory: "16GB Unified Memory",
      storage: "512GB SSD",
      processor: "M2 Pro Chip",
    },
  },
  device_check: {
    mode: "synthetic",
    status: "not_required",
    overall_grade: "A",
    grade_label: "Excellent",
    subtitle: "Brand new · factory sealed",
    note: "Purchased new into storage — graded A, no inspection needed",
    checked_at: null,
    checked_days_ago: null,
    summary: null,
    condition_by_component: [],
    accessories_included: [],
    photos: [],
  },
};

describe("mapInStorageEquipmentDetail", () => {
  it("maps tracking, details, and device check into drawer view models", () => {
    const mapped = mapInStorageEquipmentDetail(sample);

    assert.equal(mapped.device.sourceOrderNumber, "RE-BTS-B1145-2026");
    assert.equal(mapped.device.daysInStorage, 17);
    assert.equal(mapped.lifecycle.length, 1);
    assert.equal(mapped.lifecycle[0]?.label, "Entered storage");
    assert.ok(mapped.specifications.some((s) => s.label === "Processor"));
    assert.equal(mapped.deviceCheck.kind, "new");
    if (mapped.deviceCheck.kind === "new") {
      assert.equal(mapped.deviceCheck.subtitle, "Brand new · factory sealed");
    }
  });

  it("maps tracking status labels and completed wipe objects", () => {
    const mapped = mapInStorageEquipmentDetail({
      ...sample,
      storage_status: "pending_device_check",
      storage_status_label: "Pending Device Check",
      wipe_status: {
        required: true,
        status: "completed",
        label: "Completed",
      },
      tracking: {
        ...sample.tracking,
        status: "pending_device_check",
        status_label: "Pending Device Check",
        wipe_status: {
          required: true,
          status: "completed",
          label: "Completed",
        },
      },
    });

    assert.equal(mapped.device.status, "pending_check");
    assert.equal(mapped.device.storageStatusLabel, "Pending Device Check");
    assert.equal(mapped.device.wipeStatus, "wiped");
  });

  it("maps available_actions onto the drawer device", () => {
    const mapped = mapInStorageEquipmentDetail({
      ...sample,
      available_actions: ["storage_disposal", "storage_deploy_to_employee"],
    });
    assert.deepEqual(mapped.device.availableActions, [
      "deployment",
      "disposal",
    ]);
  });
});

describe("storage equipment detail wiring", () => {
  it("DeviceDetailDrawer fetches detail via useStorageEquipmentDetail", () => {
    const source = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/DeviceDetailDrawer.tsx",
      "utf8",
    );
    assert.match(source, /useStorageEquipmentDetail/);
    assert.match(source, /DrawerTrackingTab detail=\{detail\}/);
  });

  it("registers the storage detail RTK endpoint", () => {
    const source = readFileSync(
      "src/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipmentDetail.ts",
      "utf8",
    );
    assert.match(source, /equipments\/\$\{equipmentId\}\/storage/);
  });
});
