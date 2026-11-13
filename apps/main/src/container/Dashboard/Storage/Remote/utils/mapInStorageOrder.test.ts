import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sampleInStorageOrder } from "./inStorageOrderFixture";
import { mapInStorageOrder } from "./mapInStorageOrder";

describe("mapInStorageOrder", () => {
  it("maps API order fields into StorageOrder", () => {
    const mapped = mapInStorageOrder(sampleInStorageOrder);

    assert.equal(mapped.id, sampleInStorageOrder.id);
    assert.equal(mapped.orderNumber, "RE-OFF-A70AD-2026");
    assert.equal(mapped.kind, "intake");
    assert.equal(mapped.entrySource, "offboarding");
    assert.equal(mapped.direction, "inbound");
    assert.equal(mapped.status, "action_required");
    assert.equal(mapped.deviceName, "Apple Macbook Air M3");
    assert.equal(mapped.statusLabel, "Awaiting response");
    assert.equal(mapped.country, "Nigeria");
    assert.equal(mapped.countryCode, "NG");
    assert.equal(mapped.flowLabel, "Offboarding to storage");
    assert.equal(mapped.directionLabel, "Into storage");
    assert.equal(mapped.orderedBy, "Joe Andy");
  });

  it("uses the first equipment title without inventing a +N suffix", () => {
    const mapped = mapInStorageOrder({
      ...sampleInStorageOrder,
      quantity: 3,
      equipment: [
        sampleInStorageOrder.equipment[0],
        {
          ...sampleInStorageOrder.equipment[0],
          id: "2",
          title: "Dell Latitude",
        },
        { ...sampleInStorageOrder.equipment[0], id: "3", title: "HP Monitor" },
      ],
    });

    assert.equal(mapped.deviceName, "Apple Macbook Air M3");
  });

  it("uses API type and status when flow and direction are omitted", () => {
    const mapped = mapInStorageOrder({
      ...sampleInStorageOrder,
      type: "storage_order",
      flow: null,
      flow_label: null,
      direction: null,
      direction_label: null,
      status: "verification_pending",
    });

    assert.equal(mapped.flowLabel, "Storage order");
    assert.equal(mapped.directionLabel, undefined);
    assert.equal(mapped.statusLabel, "Verification pending");
  });

  it("maps storage-to-employee deployment orders", () => {
    const mapped = mapInStorageOrder({
      ...sampleInStorageOrder,
      flow: "storage_to_employee",
      flow_label: "Storage to employee",
      direction: "out_of_storage",
      direction_label: "Out of storage",
      status: "in_progress",
      sub_orders: [
        {
          id: "sub-1",
          type: "storage_to_employee",
          status: "order_placed",
          tracking_no: "STE-123",
          employee: {
            id: "emp-1",
            first_name: "Kingdom",
            last_name: "Two",
            email: "kingdom2@yopmail.com",
          },
          equipment: sampleInStorageOrder.equipment[0],
        },
      ],
    });

    assert.equal(mapped.kind, "deployment");
    assert.equal(mapped.direction, "outbound");
    assert.equal(mapped.status, "in_progress");
    assert.equal(mapped.recipientName, "Kingdom Two");
  });
});
