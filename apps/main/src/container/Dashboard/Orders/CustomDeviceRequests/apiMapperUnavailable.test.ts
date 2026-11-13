import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapRfqToCustomDeviceRequest } from "./apiMapper";

describe("custom device request unavailable response mapper", () => {
  it("maps unavailable vendor responses for the details drawer", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-unavailable-1",
      country: { code: "GB", id: "country-1", name: "United Kingdom" },
      currency: "GBP",
      request_id: "RFQ-UNAVAILABLE-1",
      devices: [
        {
          asset_type: "asset-type-1",
          budget_per_unit: "1563.12",
          description: "HP Envy x350",
          name: "HP Envy x350",
          quantity: 1,
          total_budget: "1563.12",
        },
      ],
      response: {
        id: "response-1",
        created_at: "2026-05-29T15:53:56.000000Z",
        devices: [
          {
            id: "response-device-1",
            availability: "unavailable",
            description: "Cant fulfill this",
            name: "HP Envy x350",
            quantity: 0,
            quote_per_unit: null,
            sub_total_quote: "0.00",
          },
        ],
        note: null,
        total_quote: "0.00",
      },
      status: "waiting_for_action",
      total_request_budget: "1563.12",
      client_rejection_reason: null,
      created_at: "2026-05-29T13:42:25.000000Z",
    });

    assert.deepEqual(mapped.devices[0].vendorResponse, {
      type: "unavailable",
      unavailableReason: "Cant fulfill this",
    });
  });
});
