import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import type { IEmployees } from "@/types/employees";
import {
  approvalOrderSummaryPath,
  approvalRequestToAssignedEmployees,
} from "./approvalAssignment";

const request = {
  id: "request-1",
  employee_id: "employee-1",
  currency: { code: "GBP", symbol: "£" },
  employee: {
    id: "employee-1",
    first_name: "Ginger",
    last_name: "Twelve",
    email: "ginger12@yopmail.com",
    address: "90 Ah Str.",
    country: { id: "country-1", name: "United Kingdom", code: "GB" },
    employment_type: "Full_Time",
    phone: "+447765679088",
  },
  fulfillment: {
    marketplace: [
      {
        amount: 1500,
        asset_pricing_id: "pricing-1",
        asset_specification: {
          asset: {
            category: { name: "Laptop" },
            name: "HP Envy x350 Laptop",
            type: { id: "9e3024c8-337e-445c-b0bd-728ddbc75c09" },
          },
        },
        asset_specification_id: "spec-1",
        quantity: 2,
      },
    ],
  },
} satisfies CatalogOrderRequestApi;

describe("approval assignment order summary mapper", () => {
  it("builds the normal order summary path", () => {
    assert.equal(
      approvalOrderSummaryPath(),
      "/dashboard/equip-employee/order-summary",
    );
  });

  it("adds approval preview params to the order summary path", () => {
    const path = approvalOrderSummaryPath({
      catalogId: "catalog-1",
      options: { acknowledgeBudgetWarning: true },
      orderRequestId: "request-1",
    });

    assert.equal(
      path,
      "/dashboard/equip-employee/order-summary?approvalAcknowledgeBudgetWarning=true&approvalCatalogId=catalog-1&approvalOrderRequestId=request-1",
    );
  });

  it("prepares selected employees like the assignment flow", () => {
    const employees = approvalRequestToAssignedEmployees({ request });

    assert.equal(employees.length, 1);
    assert.equal(employees[0].id, "employee-1");
    assert.equal(employees[0].address, "90 Ah Str.");
    assert.equal(employees[0].country, "United Kingdom");
    assert.equal(employees[0].employment_type, "Full_Time");
    assert.equal(employees[0].phone, "+447765679088");
    assert.equal(employees[0].requestId, "request-1");
    assert.equal(employees[0].items?.[0].quantity, 2);
    assert.equal(employees[0].items?.[0].pricing.id, "pricing-1");
  });

  it("uses employee detail fields when approval employee data is incomplete", () => {
    const employees = approvalRequestToAssignedEmployees({
      employee: {
        address: "77 Detail Road",
        country: "United Kingdom",
        country_code: "GB",
        country_id: "country-detail",
        email: "detail@yopmail.com",
        employment_type: "Part_Time",
        first_name: "Ginger",
        id: "employee-1",
        last_name: "Twelve",
        phone: "+441111111111",
      } as IEmployees,
      request: {
        ...request,
        employee: {
          id: "employee-1",
          first_name: "Ginger",
          last_name: "Twelve",
          email: "ginger12@yopmail.com",
        },
      },
    });

    assert.equal(employees[0].address, "77 Detail Road");
    assert.equal(employees[0].country, "United Kingdom");
    assert.equal(employees[0].country_code, "GB");
    assert.equal(employees[0].country_id, "country-detail");
    assert.equal(employees[0].employment_type, "Part_Time");
    assert.equal(employees[0].phone, "+441111111111");
  });

  it("does not leak raw UUID asset type values into item specs", () => {
    const employees = approvalRequestToAssignedEmployees({ request });
    const values = employees[0].items?.[0].specification.properties.map(
      (property) => property.value,
    );

    assert.deepEqual(values, ["Laptop"]);
  });

  it("excludes declined RFQ items from approval order summaries", () => {
    const employees = approvalRequestToAssignedEmployees({
      request: {
        ...request,
        fulfillment: {
          ...request.fulfillment,
          rfq: [
            {
              kit_item_id: "kit-rfq-1",
              asset_specification_id: "spec-rfq-1",
              budget_per_unit: 2500,
              name: "Declined RFQ Laptop",
              quantity: 1,
              rfq_resolution: { status: "declined" },
            },
          ],
        },
      },
    });

    assert.equal(employees[0].items?.length, 1);
    assert.equal(employees[0].items?.[0].asset.name, "HP Envy x350 Laptop");
  });
});
