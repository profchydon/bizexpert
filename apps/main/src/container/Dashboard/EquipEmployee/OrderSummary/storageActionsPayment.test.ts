import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { buildStorageActionsInitiatePayload } from "./buildStorageActionsInitiatePayload";
import { toStorageActionFeeOrders } from "@/api/baseQueries/feesApi/storageActionFeeOrders";

describe("storageActionsPayment", () => {
  it("posts to /{companyId}/transactions/storage-actions/initiate", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/transactionsApi/storageActionsPayment.ts",
      ),
      "utf8",
    );

    assert.match(
      source,
      /\/\$\{companyId\}\/transactions\/storage-actions\/initiate/,
    );
    assert.match(source, /companyId: string/);
    assert.match(source, /query: \(\{ companyId, \.\.\.payload \}\)/);
    assert.match(source, /data: payload/);
    assert.match(source, /payment_method/);
    assert.match(source, /country_id/);
    assert.match(source, /redirect_url/);
    assert.match(source, /order_note/);
    assert.match(source, /additional_recipients/);
    assert.match(source, /orders: StorageActionInitiateOrder\[\]/);
  });
});

describe("buildStorageActionsInitiatePayload", () => {
  it("sends checkout fields plus cart orders without company_id on lines", () => {
    const feeOrders = toStorageActionFeeOrders(
      [
        {
          kind: "device_check",
          deviceId: "11111111-1111-1111-1111-111111111111",
          checkReason: "Annual inspection",
          neededBy: "2026-09-15",
        },
        {
          kind: "disposal",
          deviceId: "33333333-3333-3333-3333-333333333333",
          checkReason: "End of lease — destroy device",
          disposalMethod: "destroy",
        },
        {
          kind: "deployment",
          deviceId: "44444444-4444-4444-4444-444444444444",
          employeeId: "55555555-5555-5555-5555-555555555555",
          deviceSetup: "Install standard company profile and VPN",
        },
      ],
      "22222222-2222-2222-2222-222222222222",
    );

    assert.deepEqual(
      buildStorageActionsInitiatePayload({
        additionalRecipients: ["finance@company.com"],
        countryId: "550e8400-e29b-41d4-a716-446655440000",
        note: "Q3 storage actions batch",
        orders: feeOrders,
        paymentMethod: "Card",
        redirectUrl: "https://app.rayda.co/storage/checkout/callback",
        signatureRequested: true,
      }),
      {
        payment_method: "Card",
        country_id: "550e8400-e29b-41d4-a716-446655440000",
        redirect_url: "https://app.rayda.co/storage/checkout/callback",
        order_note: "Q3 storage actions batch",
        additional_recipients: ["finance@company.com"],
        orders: [
          {
            type: "storage_device_check",
            equipment_id: "11111111-1111-1111-1111-111111111111",
            reason: "Annual inspection",
            needed_by: "2026-09-15",
          },
          {
            type: "storage_disposal",
            equipment_id: "33333333-3333-3333-3333-333333333333",
            reason: "End of lease — destroy device",
            disposal_method: "destroy",
          },
          {
            type: "storage_deploy_to_employee",
            equipment_id: "44444444-4444-4444-4444-444444444444",
            employee_id: "55555555-5555-5555-5555-555555555555",
            signature_requested: true,
            device_setup: "Install standard company profile and VPN",
          },
        ],
      },
    );
  });
});

describe("storageActionsPayment wiring", () => {
  it("initiates storage-actions payment with the workspace company id", () => {
    const payment = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryPayment.ts",
      ),
      "utf8",
    );

    assert.match(payment, /useStorageActionsPaymentMutation/);
    assert.match(payment, /isStorageActionsFlow/);
    assert.match(payment, /storageActionsOrders/);
    assert.match(payment, /order_note|note,/);
    assert.match(payment, /additionalRecipients: additionalEmails/);
    assert.match(payment, /signatureRequested: isSignatureRequired/);
    assert.match(payment, /buildStorageActionsInitiatePayload/);
    assert.match(payment, /beginRedirect/);
    assert.match(payment, /isRedirecting/);
    assert.match(payment, /removeAllItemsFromCart/);
    assert.equal(
      payment.match(/import useCart from ["']@\/hooks\/useCart["'];/g)?.length,
      1,
    );
    assert.match(payment, /redirectAfterCheckout/);
    assert.doesNotMatch(payment, /finalizePaidCheckout/);
    assert.doesNotMatch(payment, /clearStorageActionsCart/);
    assert.match(payment, /storageActionsPayment\(\{/);
    assert.match(payment, /companyId,/);
    assert.match(payment, /\.\.\.payload/);
  });
});
