import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toStorageActionFeeOrders } from "./storageActionFeeOrders";

describe("toStorageActionFeeOrders", () => {
  it("maps check, disposal, and deploy cart items into fee orders", () => {
    assert.deepEqual(
      toStorageActionFeeOrders(
        [
          {
            kind: "device_check",
            deviceId: "11111111-1111-1111-1111-111111111111",
            companyId: "22222222-2222-2222-2222-222222222222",
            checkReason: "Annual inspection",
            neededBy: "2026-09-15",
          },
          {
            kind: "disposal",
            deviceId: "33333333-3333-3333-3333-333333333333",
            companyId: "22222222-2222-2222-2222-222222222222",
            checkReason: "End of lease — destroy device",
            disposalMethod: "destroy",
          },
          {
            kind: "deployment",
            deviceId: "44444444-4444-4444-4444-444444444444",
            companyId: "22222222-2222-2222-2222-222222222222",
            employeeId: "55555555-5555-5555-5555-555555555555",
            signatureRequested: true,
            deviceSetup: "Install standard company profile and VPN",
          },
        ],
        "22222222-2222-2222-2222-222222222222",
      ),
      [
        {
          type: "storage_device_check",
          equipment_id: "11111111-1111-1111-1111-111111111111",
          company_id: "22222222-2222-2222-2222-222222222222",
          reason: "Annual inspection",
          needed_by: "2026-09-15",
        },
        {
          type: "storage_disposal",
          equipment_id: "33333333-3333-3333-3333-333333333333",
          company_id: "22222222-2222-2222-2222-222222222222",
          reason: "End of lease — destroy device",
          disposal_method: "destroy",
        },
        {
          type: "storage_deploy_to_employee",
          equipment_id: "44444444-4444-4444-4444-444444444444",
          company_id: "22222222-2222-2222-2222-222222222222",
          employee_id: "55555555-5555-5555-5555-555555555555",
          signature_requested: true,
          device_setup: "Install standard company profile and VPN",
        },
      ],
    );
  });

  it("skips deploy lines without an employee id and does not invent disposal fields", () => {
    assert.deepEqual(
      toStorageActionFeeOrders(
        [
          { kind: "deployment", deviceId: "eq-deploy" },
          { kind: "disposal", deviceId: "eq-dispose" },
        ],
        "company-workspace",
      ),
      [
        {
          type: "storage_disposal",
          equipment_id: "eq-dispose",
          company_id: "company-workspace",
        },
      ],
    );
  });
});
