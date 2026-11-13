import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { storageItemToEquipItem } from "./storageItemToEquipItem";

const baseItem = (
  overrides: Partial<IEquipmentsInStorageByCountry> = {},
): IEquipmentsInStorageByCountry =>
  ({
    id: "eq-1",
    title: "Apple Macbook Air M3",
    description: "Apple Macbook Air M3",
    storage_duration: "6 months",
    moved_to_storage: "2025-08-25 16:25:32",
    image_url: "https://assets.rayda.co/one.jpg",
    serial_number: null,
    status: "in_storage",
    country: "United Kingdom",
    specs: { color: "Space Grey", processor: "2.7GHz", memory: "16GB" },
    ...overrides,
  }) as IEquipmentsInStorageByCountry;

describe("storageItemToEquipItem", () => {
  it("maps a storage equipment into a zero-cost storage line item", () => {
    const item = storageItemToEquipItem(baseItem(), "GBP");

    assert.equal(item.lineId, "eq-1");
    assert.equal(item.productId, "eq-1");
    assert.equal(item.name, "Apple Macbook Air M3");
    assert.equal(item.source, "STORAGE");
    assert.equal(item.origin, "MANUAL");
    assert.equal(item.unitPrice, 0);
    assert.equal(item.currency, "GBP");
    assert.equal(item.quantity, 1);
    assert.equal(item.warehouse, "United Kingdom");
    assert.equal(item.thumbnail, "https://assets.rayda.co/one.jpg");
    assert.equal(item.config, "ABM");
  });

  it("infers Intune config for a Windows storage device", () => {
    const item = storageItemToEquipItem(
      baseItem({ title: "Dell Latitude 5440" }),
    );
    assert.equal(item.config, "MI");
  });

  it("joins ordered spec values into a subtitle", () => {
    const item = storageItemToEquipItem(baseItem());
    assert.equal(item.specs, "2.7GHz · 16GB · Space Grey");
  });

  it("includes storage capacity when present in specs", () => {
    const item = storageItemToEquipItem(
      baseItem({
        specs: {
          processor: "M3 Chip",
          memory: "16GB",
          storage: "512 GB SSD",
          display: "13.6-inch Liquid Retina Display",
        },
      }),
    );
    assert.equal(
      item.specs,
      "M3 Chip · 16GB · 512 GB SSD · 13.6-inch Liquid Retina Display",
    );
  });

  it("defaults currency to USD and handles a missing image", () => {
    const item = storageItemToEquipItem(
      baseItem({ image_url: null, specs: undefined }),
    );
    assert.equal(item.currency, "USD");
    assert.equal(item.thumbnail, undefined);
    assert.equal(item.specs, undefined);
  });
});
