import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ICart } from "@/types/cart";
import type { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import {
  applyStorageDeployRecipients,
  deployRecipientArrow,
  orderSummaryEmployeeName,
  storageCartEmployeeName,
} from "./storageDeployRecipient";

describe("storageDeployRecipient", () => {
  it("prefers the cart employee name, then first and last, then email", () => {
    assert.equal(
      storageCartEmployeeName({ name: "Olu Wale", email: "olu@yopmail.com" }),
      "Olu Wale",
    );
    assert.equal(
      storageCartEmployeeName({ first_name: "Ada", last_name: "Lovelace" }),
      "Ada Lovelace",
    );
    assert.equal(
      storageCartEmployeeName({ email: "ada@example.com" }),
      "ada@example.com",
    );
    assert.equal(storageCartEmployeeName({}), undefined);
  });

  it("does not treat the unassigned order-summary stub as a recipient", () => {
    assert.equal(
      orderSummaryEmployeeName({
        id: UNASSIGNED_ORDER_SUMMARY_KEY,
        first_name: "",
        last_name: "",
      }),
      undefined,
    );
    assert.equal(deployRecipientArrow(undefined), "");
    assert.equal(deployRecipientArrow("Olu Wale"), " · → Olu Wale");
  });

  it("copies deploy recipient fields from checkout items onto cart rows", () => {
    const actionItems: CheckoutItem[] = [
      {
        id: "line-1",
        kind: "deployment",
        deviceId: "eq-1",
        deviceName: "MB-AIR-M4-7P2L8Q",
        serialNumber: "GFGHFHG",
        country: "United States",
        assetType: "Laptop",
        recipientName: "Olu Wale",
        recipientCountry: "United States",
        employeeId: "emp-1",
      },
    ];
    const employees = applyStorageDeployRecipients(
      [
        {
          id: UNASSIGNED_ORDER_SUMMARY_KEY,
          items: [
            {
              equipmentId: "eq-1",
              pricing: {
                id: "line-1",
                amount: "99",
                asset_specification_id: "line-1",
              },
            } as ICart,
          ],
        } as IEmployees,
      ],
      actionItems,
    );

    assert.equal(employees[0]?.items?.[0]?.recipientName, "Olu Wale");
    assert.equal(employees[0]?.items?.[0]?.employeeId, "emp-1");
  });
});
