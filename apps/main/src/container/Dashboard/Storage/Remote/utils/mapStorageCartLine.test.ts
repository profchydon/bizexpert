import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapStorageCartLineToCheckoutItem,
  parseStorageCartLabel,
} from "./mapStorageCartLine";

describe("mapStorageCartLine", () => {
  it("parses a two-part label without treating the suffix as a country", () => {
    assert.deepEqual(
      parseStorageCartLabel("Storage Device Check - Dell Dock"),
      {
        deviceName: "Dell Dock",
        serialNumber: "",
        country: "",
      },
    );
  });

  it("parses hyphen and em-dash storage labels", () => {
    assert.deepEqual(
      parseStorageCartLabel(
        "Storage Device Check - Dell Dock #022 - United Kingdom",
      ),
      {
        deviceName: "Dell Dock",
        serialNumber: "022",
        country: "United Kingdom",
      },
    );
    assert.deepEqual(
      parseStorageCartLabel(
        "Request disposal — Apple MacBook Pro M2 — United States",
      ),
      {
        deviceName: "Apple MacBook Pro M2",
        serialNumber: "",
        country: "United States",
      },
    );
  });

  it("maps check and disposal lines onto checkout items", () => {
    const check = mapStorageCartLineToCheckoutItem({
      type: "storage_device_check",
      id: "line-1",
      equipment_id: "eq-1",
      company_id: "company-a",
      label: "Storage Device Check - Dell Dock #022 - United Kingdom",
      reason: "Pre-deployment check",
      needed_by: "2026-08-19",
    });

    assert.equal(check.kind, "device_check");
    assert.equal(check.deviceId, "eq-1");
    assert.equal(check.companyId, "company-a");
    assert.equal(check.checkReason, "Pre-deployment check");
    assert.equal(check.neededBy, "2026-08-19");

    const disposal = mapStorageCartLineToCheckoutItem({
      type: "storage_disposal",
      equipment_id: "eq-2",
      company_id: "company-a",
    });
    assert.equal(disposal.kind, "disposal");
    assert.equal(disposal.deviceId, "eq-2");

    const deploy = mapStorageCartLineToCheckoutItem({
      type: "storage_deploy_to_employee",
      equipment_id: "eq-3",
      company_id: "company-a",
      employee_id: "emp-3",
      employee: {
        id: "emp-3",
        name: "Ada Lovelace",
        country: "United Kingdom",
      },
    });
    assert.equal(deploy.kind, "deployment");
    assert.equal(deploy.deviceId, "eq-3");
    assert.equal(deploy.employeeId, "emp-3");
    assert.equal(deploy.recipientName, "Ada Lovelace");
    assert.equal(deploy.recipientCountry, "United Kingdom");

    const apiDeploy = mapStorageCartLineToCheckoutItem({
      type: "storage_deploy_to_employee",
      id: "0756b33c-37d3-43e8-a22d-b0f5c547f53b",
      equipment_id: "019f8f89-dd7f-731f-ba45-ffaf0a664af8",
      employee_id: "019fb211-d3e3-728a-8e68-8b0883820c1d",
      company_id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
      label: "Deploy to employee — MB-AIR-M4-7P2L8Q — Olu Wale",
      equipment: {
        id: "019f8f89-dd7f-731f-ba45-ffaf0a664af8",
        title: "MB-AIR-M4-7P2L8Q",
        serial_number: "GFGHFHG",
        type: "Laptop/Workstation",
        country: "United States",
      },
      employee: {
        id: "019fb211-d3e3-728a-8e68-8b0883820c1d",
        name: "Olu Wale",
        email: "oluwale@yopmail.com",
        country: "United States",
      },
      currency: "£",
    });
    assert.equal(apiDeploy.recipientName, "Olu Wale");
    assert.equal(apiDeploy.deviceName, "MB-AIR-M4-7P2L8Q");
    assert.equal(apiDeploy.serialNumber, "GFGHFHG");
    assert.equal(apiDeploy.country, "United States");
  });

  it("uses equipment, disposal method, and currency from the cart GET line", () => {
    const item = mapStorageCartLineToCheckoutItem({
      type: "storage_disposal",
      id: "a0232d6c-5880-4b15-8b30-463b82d706a1",
      equipment_id: "019f8bac-4110-70dc-82c8-84fe66b8e553",
      company_id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
      label: "Request disposal — Apple MacBook Pro M2 — United States",
      equipment: {
        id: "019f8bac-4110-70dc-82c8-84fe66b8e553",
        title: "Apple MacBook Pro M2",
        serial_number: "HKAJSH",
        type: "Laptop/Workstation",
        country: "United States",
      },
      disposal_method: "destroy",
      unit_amount: 75,
      quantity: 1,
      amount: 75,
      currency: "£",
    });

    assert.equal(item.deviceName, "Apple MacBook Pro M2");
    assert.equal(item.serialNumber, "HKAJSH");
    assert.equal(item.country, "United States");
    assert.equal(item.assetType, "Laptop/Workstation");
    assert.equal(item.disposalMethod, "destroy");
    assert.equal(item.currency, "£");
  });
});
