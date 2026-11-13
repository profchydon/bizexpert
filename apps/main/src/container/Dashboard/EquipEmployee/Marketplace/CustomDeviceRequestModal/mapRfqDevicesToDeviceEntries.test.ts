import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { RFQDevice } from "@/container/Dashboard/Orders/CustomDeviceRequests/types";
import {
  mapRfqDeviceToDeviceEntry,
  mapRfqDevicesToDeviceEntries,
} from "./mapRfqDevicesToDeviceEntries";

describe("mapRfqDevicesToDeviceEntries", () => {
  it("maps RFQ device fields into create-request form entries", () => {
    const device: RFQDevice = {
      name: "HP Speakers",
      quantity: 5,
      unitPrice: 600,
      assetType: "accessories-type-id",
      description: "Need black finish.",
      specification: {
        RAM: "16GB",
        storage: "512GB SSD",
      },
    };

    assert.deepEqual(mapRfqDeviceToDeviceEntry(device, "1"), {
      id: "1",
      deviceName: "HP Speakers",
      assetType: "accessories-type-id",
      quantity: "5",
      budgetPrice: "600",
      description: "Need black finish.",
      extendedSpecs: [
        { id: "0", key: "condition", value: "" },
        { id: "1", key: "ram", value: "16GB" },
        { id: "2", key: "storage", value: "512GB SSD" },
      ],
    });
  });

  it("maps multiple devices with incrementing ids", () => {
    const mapped = mapRfqDevicesToDeviceEntries([
      {
        name: "HP Speakers",
        quantity: 5,
        assetType: "accessories-type-id",
      },
      {
        name: "Dell Monitor",
        quantity: 2,
        unitPrice: 250,
        assetType: "monitor-type-id",
      },
    ]);

    assert.equal(mapped.length, 2);
    assert.equal(mapped[0]?.id, "1");
    assert.equal(mapped[1]?.id, "2");
    assert.equal(mapped[1]?.budgetPrice, "250");
  });
});
