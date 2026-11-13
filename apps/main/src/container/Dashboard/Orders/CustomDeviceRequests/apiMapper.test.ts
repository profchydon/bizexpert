import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapRfqToCustomDeviceRequest } from "./apiMapper";
import { resolveRfqStatus } from "./rfqExpiration";

describe("custom device request API mapper", () => {
  it("maps asset type ids to display names", () => {
    const mapped = mapRfqToCustomDeviceRequest(
      {
        id: "rfq-1",
        country: {
          code: "GB",
          id: "country-1",
          name: "United Kingdom",
        },
        currency: "GBP",
        request_id: "RFQ-1",
        devices: [
          {
            asset_type: "asset-type-1",
            budget_per_unit: "2000.00",
            description: "Laptop",
            name: "Apple MacBook Air M2",
            quantity: 1,
            total_budget: "2000.00",
          },
          {
            asset_type: "Laptop/Workstation",
            budget_per_unit: "0.00",
            description: "Custom laptop",
            name: "Custom Gaming Laptop",
            quantity: 2,
            total_budget: "0.00",
          },
        ],
        response: null,
        status: "pending",
        total_request_budget: "2000.00",
        client_rejection_reason: null,
        created_at: "2026-05-08T07:56:55.000000Z",
        expires_at: "2026-05-13T07:56:55.000000Z",
      },
      new Map([["asset-type-1", "Laptop/Workstation"]]),
    );

    assert.equal(mapped.expiresAt, undefined);
    assert.equal(mapped.devices[0].assetTypeName, "Laptop/Workstation");
    assert.equal(mapped.devices[1].assetTypeName, "Laptop/Workstation");
  });

  it("maps catalog approval request references from RFQ details", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-approval-1",
      catalog_order_request: {
        id: "request-1",
        catalog_id: "catalog-1",
        catalog: { id: "catalog-1", name: "QA Nigeria Catalog Policy" },
      },
      country: {
        code: "GB",
        id: "country-1",
        name: "United Kingdom",
      },
      currency: "GBP",
      request_id: "RFQ-APPROVAL-1",
      devices: [],
      response: null,
      status: "waiting_for_action",
      total_request_budget: "0.00",
      client_rejection_reason: null,
      created_at: "2026-05-29T13:42:25.000000Z",
    });

    assert.deepEqual(mapped.catalogOrderRequest, {
      id: "request-1",
      catalogId: "catalog-1",
      catalogName: "QA Nigeria Catalog Policy",
    });
  });

  it("maps country id from RFQ details", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-country-1",
      country: {
        code: "NG",
        id: "country-ng",
        name: "Nigeria",
      },
      currency: "NGN",
      request_id: "RFQ-COUNTRY-1",
      devices: [],
      response: null,
      status: "expired",
      total_request_budget: "0.00",
      client_rejection_reason: null,
      created_at: "2026-05-29T13:42:25.000000Z",
    });

    assert.equal(mapped.countryId, "country-ng");
    assert.equal(mapped.countryCode, "NG");
    assert.equal(mapped.country, "Nigeria");
  });

  it("maps declined RFQs to the rejected drawer state", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-declined-1",
      country: {
        code: "GB",
        id: "country-1",
        name: "United Kingdom",
      },
      currency: "GBP",
      request_id: "RFQ-DECLINED-1",
      devices: [],
      response: null,
      status: "declined",
      total_request_budget: "0.00",
      client_rejection_reason: null,
      created_at: "2026-05-29T13:42:25.000000Z",
    });

    assert.equal(mapped.status, "rejected");
  });

  it("formats html and plain text descriptions", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-2",
      country: {
        code: "NL",
        id: "country-2",
        name: "Netherlands",
      },
      currency: "GBP",
      request_id: "RFQ-2",
      devices: [
        {
          asset_type: "asset-type-1",
          budget_per_unit: "2300.00",
          description: "<p>Test &amp; validate</p><p>Second line</p>",
          name: "Asus",
          quantity: 1,
          total_budget: "2300.00",
        },
        {
          asset_type: "asset-type-2",
          budget_per_unit: "400000.00",
          description: "Plain text",
          name: "Acer Aspire 5",
          quantity: 1,
          total_budget: "400000.00",
        },
        {
          asset_type: "asset-type-3",
          budget_per_unit: "20000.00",
          description: "<p></p>",
          name: "Iphone",
          quantity: 1,
          total_budget: "20000.00",
        },
      ],
      response: null,
      status: "pending",
      total_request_budget: "422300.00",
      client_rejection_reason: null,
      created_at: "2026-05-08T07:43:25.000000Z",
      expires_at: "2026-05-13T07:43:25.000000Z",
    });

    assert.equal(mapped.devices[0].description, "Test & validate\nSecond line");
    assert.equal(mapped.devices[1].description, "Plain text");
    assert.equal(mapped.devices[2].description, undefined);
  });

  it("maps request device specifications for the details drawer", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-3",
      country: {
        code: "GB",
        id: "country-1",
        name: "United Kingdom",
      },
      currency: "GBP",
      request_id: "RFQ-3",
      devices: [
        {
          asset_type: "Laptop/Workstation",
          budget_per_unit: "1500.00",
          description: "Added new specs",
          name: "Test 1",
          quantity: 2,
          specification: {
            condition: "Used",
            RAM: "12GB",
            storage: "256GB",
          },
          total_budget: "3000.00",
        },
      ],
      response: null,
      status: "pending",
      total_request_budget: "3000.00",
      client_rejection_reason: null,
      created_at: "2026-05-19T08:05:10.000000Z",
      expires_at: "2026-05-24T08:05:10.000000Z",
    });

    assert.deepEqual(mapped.devices[0].specification, {
      condition: "Used",
      RAM: "12GB",
      storage: "256GB",
    });
  });

  it("maps response_expires_at for quoted RFQs", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-quote-expiry",
      country: {
        code: "NG",
        id: "country-ng",
        name: "Nigeria",
      },
      currency: "GBP",
      request_id: "RFQ-00010",
      devices: [],
      response: {
        id: "response-1",
        devices: [],
        total_quote: "90000.00",
        note: null,
        response_expires_at: "2026-04-01T14:28:00.000000Z",
        created_at: "2026-03-25T14:28:00.000000Z",
      },
      status: "waiting_for_action",
      total_request_budget: "90000.00",
      client_rejection_reason: null,
      created_at: "2026-03-25T14:26:49.000000Z",
      expires_at: "2026-03-30T14:26:49.000000Z",
      response_expires_at: "2026-04-01T14:28:00.000000Z",
    });

    assert.equal(mapped.expiresAt, "Apr 01, 2026");
  });

  it("maps approved_at for approved RFQs", () => {
    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-approved-1",
      country: {
        code: "NG",
        id: "country-ng",
        name: "Nigeria",
      },
      currency: "GBP",
      request_id: "RFQ-APPROVED-1",
      devices: [],
      response: null,
      status: "confirmed",
      total_request_budget: "90000.00",
      client_rejection_reason: null,
      created_at: "2026-03-25T14:26:49.000000Z",
      approved_at: "2026-03-25T14:28:00.000000Z",
    });

    assert.equal(mapped.approvedAt, "Mar 25, 2026");
  });

  it("maps expired waiting_for_action RFQs to the expired drawer state", () => {
    assert.equal(
      resolveRfqStatus("waiting_for_action", "2020-01-01T00:00:00.000000Z"),
      "expired",
    );

    const mapped = mapRfqToCustomDeviceRequest({
      id: "rfq-expired-1",
      country: {
        code: "GB",
        id: "country-1",
        name: "United Kingdom",
      },
      currency: "GBP",
      request_id: "RFQ-EXPIRED-1",
      devices: [],
      response: {
        id: "response-1",
        devices: [],
        total_quote: "2400.00",
        note: null,
        created_at: "2020-01-02T00:00:00.000000Z",
      },
      status: "waiting_for_action",
      total_request_budget: "2400.00",
      client_rejection_reason: null,
      created_at: "2020-01-01T00:00:00.000000Z",
      expires_at: "2020-01-08T00:00:00.000000Z",
      response_expires_at: "2020-01-08T00:00:00.000000Z",
    });

    assert.equal(mapped.status, "expired");
  });
});
