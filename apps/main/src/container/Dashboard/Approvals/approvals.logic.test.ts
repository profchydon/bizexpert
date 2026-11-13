import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CatalogPolicyApiPolicy } from "@/types/catalogPolicy";

import {
  approvedOrderHref,
  approvedOrderDescription,
  approvedOrderTitle,
} from "./components/ApprovedApprovalContent";
import { buildEmployeesMap, orderRequestListToRecords } from "./apiAdapters";
import { approvalTabs } from "./data";
import {
  enrichApprovalRecord,
  getApprovalPolicyAllowItemSwap,
  getApprovalPolicyKitIds,
} from "./enrichment";
import { approvalPageSize, orderRequestPageMeta } from "./pagination";
import {
  assetsToSwapCandidates,
  employeeCountryId,
  isSwapDraftValid,
  kitItemsToSwapCandidates,
  nextSwapSelection,
  shouldFocusSwapReason,
  swapCandidatePageSize,
  swapDraftToPayload,
  swapPaginationMeta,
} from "./swapUtils";
import type { ApprovalRecord } from "./types";
import {
  approvalStatsToCounts,
  approveOrderRequestPayload,
  computeApprovalCounts,
  approvalFooterNoteText,
  approvalPrimaryActionLabel,
  convertToRfqPayload,
  defaultApprovalTab,
  filterApprovals,
  formatApprovalMoney,
  recordsForApprovalTab,
  selectedApprovalRecord,
  sortApprovals,
  unavailableApprovalFooterNote,
} from "./utils";

const approvalRecords: ApprovalRecord[] = [
  record("apr-001", "emp-1", "Olivia Rhye", "AWAITING_APPROVAL"),
  record("apr-002", "emp-2", "Marcus Rivera", "AWAITING_APPROVAL"),
  record("apr-003", "emp-3", "Lana Steiner", "AWAITING_RFQ"),
  record("apr-004", "emp-4", "Maya Chen", "APPROVED"),
];
const employees = buildEmployeesMap(approvalRecords);

describe("approvals UI logic", () => {
  it("defaults to the awaiting approvals tab", () => {
    assert.equal(defaultApprovalTab, "awaiting");
  });

  it("shows only the visible approval table tabs", () => {
    assert.deepEqual(
      approvalTabs.map((tab) => tab.label),
      ["All", "Awaiting"],
    );
  });

  it("counts approval summary tiles from local records", () => {
    const counts = computeApprovalCounts(approvalRecords);

    assert.equal(counts.awaiting, 2);
    assert.equal(counts.rfq, 1);
    assert.equal(counts.approved, 1);
  });

  it("maps approval stats response to summary counts", () => {
    const counts = approvalStatsToCounts({
      approved_last_seven_days: "3",
      pending_approval_count: 4,
      pending_rfq_count: "2",
      rejected_last_seven_days: null,
    });

    assert.deepEqual(counts, {
      approved: 3,
      awaiting: 4,
      rejected: 0,
      rfq: 2,
    });
  });

  it("maps approve budget acknowledgement into the request payload", () => {
    assert.deepEqual(approveOrderRequestPayload(), undefined);
    assert.deepEqual(approveOrderRequestPayload({}), undefined);
    assert.deepEqual(
      approveOrderRequestPayload({ acknowledgeBudgetWarning: true }),
      { acknowledge_budget_warning: true },
    );
  });

  it("maps exceeded budget evaluation into approval records", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-budget",
          catalog_id: "catalog-1",
          employee_id: "emp-1",
          status: "pending",
          total_amount: 6600,
          budget_evaluation: {
            budget: "1000",
            total: 9800,
            is_exceeded: true,
          },
          items: [],
        },
      ],
    });

    assert.equal(records[0].budgetAmount, 1000);
    assert.equal(records[0].budgetTotalAmount, 9800);
    assert.equal(records[0].budgetExceeded, true);
    assert.equal(records[0].totalAmount, 9800);
  });

  it("filters approvals by tab and search", () => {
    const awaiting = filterApprovals({
      employees,
      records: approvalRecords,
      search: "",
      tab: "awaiting",
    });
    const searched = filterApprovals({
      employees,
      records: approvalRecords,
      search: "engineering",
      tab: "all",
    });

    assert.deepEqual(
      awaiting.map((item) => item.status),
      ["AWAITING_APPROVAL", "AWAITING_APPROVAL", "AWAITING_RFQ"],
    );
    assert.equal(searched[0].kitName, "Engineering Starter Kit");
  });

  it("uses pending records only for awaiting and all records otherwise", () => {
    assert.deepEqual(
      recordsForApprovalTab({
        allRecords: approvalRecords,
        pendingRecords: [approvalRecords[0]],
        tab: "awaiting",
      }),
      [approvalRecords[0]],
    );
    assert.deepEqual(
      recordsForApprovalTab({
        allRecords: approvalRecords,
        pendingRecords: [approvalRecords[0]],
        tab: "all",
      }),
      approvalRecords,
    );
  });

  it("ignores stale detail data after the selected approval is cleared", () => {
    assert.equal(
      selectedApprovalRecord({
        selectedDetail: approvalRecords[1],
        selectedSummary: null,
      }),
      null,
    );
    assert.equal(
      selectedApprovalRecord({
        selectedDetail: approvalRecords[0],
        selectedSummary: approvalRecords[0],
      }),
      approvalRecords[0],
    );
  });

  it("ignores stale detail data for a previously selected approval", () => {
    assert.equal(
      selectedApprovalRecord({
        selectedDetail: approvalRecords[0],
        selectedSummary: approvalRecords[1],
      }),
      approvalRecords[1],
    );
  });

  it("reads approvals pagination metadata from API payloads", () => {
    const meta = orderRequestPageMeta({
      fallbackPage: 1,
      fallbackTotal: 0,
      payload: {
        data: [],
        total: 45,
        per_page: approvalPageSize,
        current_page: 2,
        last_page: 3,
      },
    });

    assert.deepEqual(meta, {
      page: 2,
      perPage: 20,
      total: 45,
      totalPages: 3,
    });
  });

  it("prefers currency symbols when formatting approval money", () => {
    assert.equal(
      formatApprovalMoney({
        amount: 2500,
        currencyCode: "GBP",
        currencySymbol: "£",
      }),
      "£2,500",
    );
  });

  it("places negative signs before currency symbols", () => {
    assert.equal(
      formatApprovalMoney({
        amount: -100,
        currencySymbol: "£",
      }),
      "-£100",
    );
  });

  it("sorts approval records by employee name", () => {
    const sorted = sortApprovals(approvalRecords, employees, {
      column: "employee",
      direction: "ascending",
    });

    assert.deepEqual(
      sorted.map((item) => employees.get(item.employeeId)?.name),
      ["Lana Steiner", "Marcus Rivera", "Maya Chen", "Olivia Rhye"],
    );
  });

  it("adapts catalog order request API responses for the approval UI", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-1",
          catalog_policy_id: "policy-1",
          catalog_rule_id: "rule-1",
          currency: {
            id: "currency-1",
            code: "GBP",
            name: "British Pound Sterling",
            symbol: "£",
          },
          fulfillment: {
            summary: {
              marketplace_count: 1,
              rfq_count: 0,
              storage_count: 2,
            },
            marketplace: [
              {
                kit_item_id: "kit-item-1",
                asset_pricing_id: "price-1",
                kit: { id: "kit-1", name: "Engineering Starter Kit" },
                kit_item: {
                  id: "kit-item-1",
                  kit_id: "kit-1",
                  required: true,
                },
                asset_specification: {
                  asset: {
                    name: "MacBook Pro",
                    category: { id: "category-1", name: "Laptop" },
                  },
                },
              },
            ],
            rfq: [],
            storage: [],
          },
          order_id: "order-1",
          order_note: "Deliver next week",
          status: "pending_approval",
          total_amount: 5000,
          updated_at: "2026-05-06T19:43:02+01:00",
          employee: {
            id: "emp-1",
            first_name: "Olivia",
            last_name: "Rhye",
            job_title: "Product Designer",
            level: "L4",
            country: { name: "United States" },
          },
          catalog_policy: { name: "Engineering Onboarding Policy" },
          kit: { id: "kit-1", name: "Engineering Starter Kit" },
          allow_item_swap: true,
          items: [
            {
              kit_item_id: "kit-item-1",
              asset_pricing_id: "price-1",
              quantity: 2,
              amount: 5000,
            },
          ],
        },
      ],
    });

    assert.equal(records[0].status, "AWAITING_APPROVAL");
    assert.equal(records[0].catalogId, "policy-1");
    assert.equal(records[0].catalogRuleId, "rule-1");
    assert.equal(records[0].employee?.name, "Olivia Rhye");
    assert.equal(records[0].currencyCode, "GBP");
    assert.equal(records[0].currencySymbol, "£");
    assert.deepEqual(records[0].fulfillmentSources, ["STORAGE", "MARKETPLACE"]);
    assert.equal(records[0].kitId, "kit-1");
    assert.equal(records[0].orderId, "order-1");
    assert.equal(records[0].orderNote, "Deliver next week");
    assert.equal(records[0].totalAmount, 5000);
    assert.equal(records[0].updatedAt, "2026-05-06T19:43:02+01:00");
    assert.equal(records[0].items[0].id, "kit-item-1");
    assert.equal(records[0].items[0].category, "Laptop");
    assert.equal(records[0].items[0].categoryId, "category-1");
    assert.equal(records[0].items[0].kitId, "kit-1");
    assert.equal(records[0].items[0].name, "MacBook Pro");
    assert.equal(records[0].items[0].quantity, 2);
    assert.equal(records[0].items[0].amount, 5000);
    assert.equal(records[0].items[0].source, "MARKETPLACE");
    assert.equal(records[0].items[0].tier, "REQUIRED");
    assert.equal(approvalPrimaryActionLabel(records[0]), "Approve");
    assert.deepEqual(convertToRfqPayload(records[0]), { devices: [] });
  });

  it("formats approved approval modal status copy", () => {
    const approvedRecord = {
      ...record("apr-1", "employee-1", "Catalog One", "APPROVED"),
      actionedBy: {
        admin: "Eddy Kemboi",
        at: "2026-05-07T15:31:00+01:00",
      },
      orderId: "order-1",
      orderRef: "RAY-3486",
    };

    assert.equal(approvedOrderTitle(approvedRecord), "Order RAY-3486 placed");
    assert.equal(
      approvedOrderHref(approvedRecord),
      "/dashboard/orders/order-1",
    );
    assert.equal(approvedOrderHref(approvedRecord, true), null);
    assert.match(
      approvedOrderDescription(approvedRecord),
      /^Approved by Eddy Kemboi on .+ The order request is locked from further changes\.$/,
    );
  });

  it("maps approved by details from approver responses", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-approved",
          catalog_id: "catalog-1",
          employee_id: "employee-1",
          status: "approved",
          approved_by: "admin-1",
          approved_at: "2026-05-12T17:36:36+01:00",
          approver: {
            id: "admin-1",
            first_name: "Femi",
            last_name: "Adesanya",
            email: "femisanya@yopmail.com",
          },
          items: [],
        },
      ],
    });

    assert.deepEqual(records[0].actionedBy, {
      admin: "Femi Adesanya",
      at: "2026-05-12T17:36:36+01:00",
    });
  });

  it("uses fulfillment details from the single order request response", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-1",
          catalog_id: "catalog-1",
          employee_id: "emp-1",
          status: "pending",
          fulfillment: {
            summary: { marketplace_count: 1, rfq_count: 1, storage_count: 0 },
            marketplace: [
              {
                kit_item_id: "kit-item-1",
                asset_pricing_id: "price-1",
                amount: 2000,
                kit: { id: "kit-1", name: "Another Kit" },
                kit_item: { id: "kit-item-1", kit_id: "kit-1", required: true },
                quantity: 1,
                asset_specification: {
                  asset: {
                    name: "Apple MacBook Air M2",
                    category: { id: "category-1", name: "Macbook" },
                  },
                },
              },
            ],
            rfq: [
              {
                kit_item_id: "kit-item-2",
                budget_per_unit: 1000,
                kit: { id: "kit-1", name: "Another Kit" },
                kit_item: {
                  id: "kit-item-2",
                  kit_id: "kit-1",
                  quantity: 3,
                  required: true,
                },
                quantity: 3,
                asset_specification: {
                  asset: {
                    name: "Maa 453",
                    category: { id: "category-2", name: "Laptop" },
                  },
                },
              },
            ],
            storage: [],
          },
          items: [],
        },
      ],
    });

    assert.equal(records[0].kitName, "Another Kit");
    assert.deepEqual(records[0].fulfillmentSources, ["MARKETPLACE", "RFQ"]);
    assert.equal(records[0].items.length, 2);
    assert.equal(records[0].items[0].name, "Apple MacBook Air M2");
    assert.equal(records[0].items[0].category, "Macbook");
    assert.equal(records[0].items[0].categoryId, "category-1");
    assert.equal(records[0].items[0].kitId, "kit-1");
    assert.equal(records[0].items[0].quantity, 1);
    assert.equal(records[0].items[0].amount, 2000);
    assert.equal(records[0].items[0].source, "MARKETPLACE");
    assert.equal(records[0].items[0].tier, "REQUIRED");
    assert.equal(records[0].items[1].name, "Maa 453");
    assert.equal(records[0].items[1].category, "Laptop");
    assert.equal(records[0].items[1].quantity, 3);
    assert.equal(records[0].items[1].amount, 3000);
    assert.equal(records[0].items[1].source, "RFQ");
    assert.equal(records[0].items[1].tier, "REQUIRED");
    assert.equal(records[0].totalAmount, 5000);
  });

  it("uses storage fulfillment estimated amounts in approval details", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-storage",
          catalog_id: "catalog-1",
          employee_id: "emp-1",
          status: "pending",
          fulfillment: {
            summary: {
              marketplace_count: 0,
              rfq_count: 0,
              storage_count: 1,
              unavailable_count: 1,
            },
            marketplace: [],
            rfq: [],
            storage: [
              {
                kit_item_id: "kit-item-storage",
                estimated_unit_amount: 3200,
                quantity: 1,
                asset_specification: {
                  asset: { name: "Apple Macbook Air M3" },
                },
              },
            ],
            unavailable: [
              {
                kit_item_id: "kit-item-unavailable",
                budget_per_unit: 6.47,
                quantity: 1,
                asset_specification: { asset: { name: "Dell" } },
              },
            ],
          },
          items: [],
        },
      ],
    });

    assert.equal(records[0].items[0].source, "STORAGE");
    assert.equal(records[0].items[0].amount, 3200);
    assert.equal(records[0].totalAmount, 3206.47);
  });

  it("uses unavailable fulfillment rows and images in approval details", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-unavailable",
          catalog_id: "catalog-1",
          employee_id: "emp-1",
          status: "pending",
          currency: { code: "GBP", symbol: "£" },
          fulfillment: {
            summary: {
              marketplace_count: 0,
              rfq_count: 0,
              storage_count: 0,
              unavailable_count: 1,
            },
            marketplace: [],
            rfq: [],
            storage: [],
            unavailable: [
              {
                kit_item_id: "kit-item-1",
                asset_specification_id: "spec-1",
                budget_per_unit: 2000,
                quantity: 2,
                kit: { id: "kit-1", name: "Operations UK Kit" },
                kit_item: {
                  id: "kit-item-1",
                  kit_id: "kit-1",
                  required: true,
                },
                asset_specification: {
                  images: [],
                  asset: {
                    name: "Apple MacBook Air M2",
                    description: "Apple MacBook Air M2 device",
                    images: ["https://assets.rayda.co/macbook.png"],
                    category: { id: "category-1", name: "Macbook" },
                    type: {
                      id: "asset-type-1",
                      name: "Laptop/Workstation",
                    },
                  },
                },
              },
            ],
          },
          items: [],
        },
      ],
    });

    assert.deepEqual(records[0].fulfillmentSources, ["UNAVAILABLE"]);
    assert.equal(records[0].items.length, 1);
    assert.equal(records[0].items[0].name, "Apple MacBook Air M2");
    assert.equal(records[0].items[0].category, "Macbook");
    assert.equal(
      records[0].items[0].imageUrl,
      "https://assets.rayda.co/macbook.png",
    );
    assert.equal(records[0].items[0].amount, 4000);
    assert.equal(records[0].items[0].quantity, 2);
    assert.equal(records[0].totalAmount, 4000);
    assert.equal(records[0].items[0].source, "UNAVAILABLE");
    assert.equal(records[0].items[0].tier, "REQUIRED");
    assert.equal(approvalPrimaryActionLabel(records[0]), "Convert to RFQ");
    assert.equal(
      approvalFooterNoteText({ historical: false, record: records[0] }),
      unavailableApprovalFooterNote,
    );
    assert.deepEqual(convertToRfqPayload(records[0]), {
      devices: [
        {
          asset_type: "asset-type-1",
          budget_per_unit: 2000,
          description: "Apple MacBook Air M2 device",
          kit_item_id: "kit-item-1",
          name: "Apple MacBook Air M2",
          quantity: 2,
        },
      ],
    });
  });

  it("finds matched policy kit ids and enriches approval item details", () => {
    const policy = {
      id: "policy-1",
      company_id: "company-1",
      created_by: null,
      name: "Policy",
      description: null,
      selection_mode: "fixed",
      approval_type: "manual",
      purpose: null,
      status: "active",
      budget_per_employee: null,
      is_archived: false,
      created_at: "2026-05-06T16:39:36+01:00",
      updated_at: "2026-05-06T16:39:36+01:00",
      rules: {
        data: [
          {
            id: "rule-1",
            catalog_id: "policy-1",
            type: "main",
            name: "Rule",
            allow_item_swap: true,
            kits: { data: [{ id: "kit-1" }, { id: "kit-2" }] },
            specificity_score: 1,
            is_active: true,
            created_at: "2026-05-06T16:39:36+01:00",
            updated_at: "2026-05-06T16:39:36+01:00",
          },
        ],
      },
    } as CatalogPolicyApiPolicy;
    const kitIds = getApprovalPolicyKitIds(policy, "rule-1");
    const enriched = enrichApprovalRecord(
      {
        ...record("req-1", "employee-1", "Catalog One", "AWAITING_APPROVAL"),
        allowItemSwap: false,
        catalogRuleId: "rule-1",
        items: [{ id: "item-1", kitItemId: "kit-item-1", quantity: 1 }],
      },
      [
        {
          id: "kit-item-1",
          kit_id: "kit-1",
          asset_specification_id: "asset-spec-1",
          created_at: "2026-05-06T16:39:36+01:00",
          quantity: 1,
          required: true,
          sort_order: 1,
          updated_at: "2026-05-06T16:39:36+01:00",
          asset_specification: {
            id: "asset-spec-1",
            asset: {
              category: {
                id: "category-1",
                name: "Laptop",
              },
            },
            category: "Laptop",
            images: ["https://example.com/macbook.png"],
            lead_time_days: 3,
            name: 'Apple MacBook Air 13" M1',
            source: "storage",
          },
        },
      ],
      { allowItemSwap: getApprovalPolicyAllowItemSwap(policy, "rule-1") },
    );

    assert.deepEqual(kitIds, ["kit-1", "kit-2"]);
    assert.equal(enriched.allowItemSwap, true);
    assert.equal(enriched.items[0].categoryId, "category-1");
    assert.equal(enriched.items[0].kitId, "kit-1");
    assert.equal(enriched.items[0].name, 'Apple MacBook Air 13" M1');
    assert.equal(enriched.items[0].category, "Laptop");
    assert.equal(enriched.items[0].imageUrl, "https://example.com/macbook.png");
    assert.equal(enriched.items[0].leadTimeDays, 3);
    assert.equal(enriched.items[0].source, "STORAGE");
    assert.equal(enriched.items[0].tier, "REQUIRED");
    assert.equal(enriched.items[0].quantity, 1);
  });

  it("maps kit items into item swap candidates and validates reasons", () => {
    const candidates = kitItemsToSwapCandidates(
      {
        data: [
          {
            id: "kit-item-1",
            asset_specification_id: "asset-spec-current",
            name: "Current monitor",
            category: { id: "category-1", name: "Display" },
          },
          {
            id: "kit-item-2",
            asset_specification_id: "asset-spec-2",
            name: "Samsung 32 inch 4K Smart Monitor M8",
            category: { id: "category-1", name: "Display" },
            asset_pricing: {
              id: "pricing-1",
              amount: "14500",
              currency: { symbol: "£" },
            },
            images: ["monitor.png"],
            lead_time_days: 4,
          },
        ],
      },
      {
        categoryId: "category-1",
        originalKitItemId: "kit-item-1",
        search: "samsung",
      },
    );

    assert.deepEqual(candidates[0], {
      amount: 14500,
      category: "Display",
      categoryId: "category-1",
      currencySymbol: "£",
      id: "kit-item-2",
      imageUrl: "monitor.png",
      leadTimeLabel: "4 - 6 Days",
      name: "Samsung 32 inch 4K Smart Monitor M8",
      replacementAssetSpecificationId: "asset-spec-2",
      replacementKitItemId: "kit-item-2",
      source: "KIT",
    });
    assert.equal(
      isSwapDraftValid({ reason: "Out of stock", selectedId: "candidate-1" }),
      true,
    );
    assert.equal(
      isSwapDraftValid({ reason: "no", selectedId: "candidate-1" }),
      false,
    );
    assert.equal(shouldFocusSwapReason("no"), true);
    assert.equal(shouldFocusSwapReason("Out of stock"), false);
    assert.equal(
      nextSwapSelection({ candidates, selectedId: "kit-item-2" }),
      "kit-item-2",
    );
    assert.equal(
      nextSwapSelection({ candidates, selectedId: "missing" }),
      "kit-item-2",
    );
    assert.deepEqual(
      kitItemsToSwapCandidates(
        {
          data: [
            {
              id: "kit-item-other-category",
              name: "Isaac Device",
              category: { id: "category-2", name: "Workstation" },
            },
          ],
        },
        { categoryId: "category-1" },
      ),
      [],
    );
  });

  it("maps swap candidates from kit item endpoint response category names", () => {
    const candidates = kitItemsToSwapCandidates(
      {
        data: [
          {
            id: "current-kit-item",
            asset_specification_id: "asset-spec-current",
            asset_specification: {
              category: "Workstation",
              name: "Bizon 4x RTX A6000 ADA",
            },
          },
          {
            id: "replacement-kit-item",
            asset_specification: {
              id: "asset-spec-replacement",
              category: "Workstation",
              images: ["bizon.png"],
              name: "Bizon 8x A100 40GB",
              asset_pricing: {
                amount: 204000,
                currency: { symbol: "£" },
              },
            },
          },
          {
            id: "macbook-kit-item",
            asset_specification: {
              category: "Macbook",
              name: "Apple MacBook Air M2",
            },
          },
        ],
      },
      {
        categoryId: "category-id-not-returned-by-endpoint",
        categoryName: "Workstation",
        originalKitItemId: "current-kit-item",
      },
    );

    assert.deepEqual(candidates, [
      {
        amount: 204000,
        category: "Workstation",
        currencySymbol: "£",
        id: "replacement-kit-item",
        imageUrl: "bizon.png",
        name: "Bizon 8x A100 40GB",
        replacementAssetSpecificationId: "asset-spec-replacement",
        replacementKitItemId: "replacement-kit-item",
        source: "KIT",
      },
    ]);
  });

  it("maps global assets into swap candidates and reads employee country id", () => {
    const candidates = assetsToSwapCandidates(
      {
        data: {
          data: [
            {
              id: "asset-current",
              asset_spec_id: "asset-spec-current",
              name: "Current MacBook",
            },
            {
              id: "asset-replacement",
              asset_spec_id: "asset-spec-replacement",
              name: "Apple MacBook Pro M3",
              category: { id: "category-2", name: "Macbook" },
              images: ["macbook-pro.png"],
              asset_pricing: {
                amount: "2400",
                currency: { symbol: "£" },
              },
            },
          ],
        },
      },
      {
        originalAssetSpecificationId: "asset-spec-current",
        search: "pro",
      },
    );

    assert.deepEqual(candidates, [
      {
        amount: 2400,
        category: "Macbook",
        categoryId: "category-2",
        currencySymbol: "£",
        id: "asset-replacement",
        imageUrl: "macbook-pro.png",
        name: "Apple MacBook Pro M3",
        replacementAssetSpecificationId: "asset-spec-replacement",
        replacementKitItemId: "asset-replacement",
        source: "ASSET",
      },
    ]);
    assert.equal(
      employeeCountryId({ country: { id: "country-1", name: "Nigeria" } }),
      "country-1",
    );
    assert.equal(employeeCountryId({ country_id: "country-2" }), "country-2");
    assert.equal(
      employeeCountryId(
        { country: "United Kingdom", country_code: "GB" },
        {
          data: [
            { id: "country-gb", code: "GB", name: "United Kingdom" },
            { id: "country-ng", code: "NG", name: "Nigeria" },
          ],
        },
      ),
      "country-gb",
    );
  });

  it("maps swap acknowledgement toggles into request payloads", () => {
    assert.deepEqual(
      swapDraftToPayload({
        acknowledgeBudgetWarning: true,
        acknowledgeCategoryChange: true,
        acknowledgeExistingItem: false,
        acknowledgeOutsideKitScope: true,
        originalKitItemId: "kit-item-1",
        quantity: 2,
        reason: "Found a better option",
        replacementAssetSpecificationId: "asset-spec-2",
        replacementKitItemId: "asset-2",
      }),
      {
        acknowledge_budget_warning: true,
        acknowledge_category_change: true,
        acknowledge_existing_item: false,
        acknowledge_outside_kit_scope: true,
        quantity: 2,
        reason: "Found a better option",
        replacement_asset_specification_id: "asset-spec-2",
      },
    );
  });

  it("keeps swap candidates paginated at ten per page", () => {
    assert.equal(swapCandidatePageSize, 10);
    assert.deepEqual(
      swapPaginationMeta({ data: { current_page: "2", last_page: "4" } }),
      { currentPage: 2, lastPage: 4 },
    );
  });

  it("maps rejected approval details from the single order request response", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-1",
          catalog: { id: "catalog-1", name: "Old Policy" },
          currency: { id: "currency-1", code: "GBP" },
          employee_id: "employee-1",
          rejection_reason: "You won thief everything wey i get.",
          status: "rejected",
          total_amount: 295630,
          updated_at: "2026-05-06T19:43:02+01:00",
          items: [{ kit_item_id: "kit-item-1", quantity: 1, amount: 2500 }],
        },
      ],
    });

    assert.equal(records[0].status, "FAILED");
    assert.equal(
      records[0].rejectionReason,
      "You won thief everything wey i get.",
    );
    assert.equal(records[0].updatedAt, "2026-05-06T19:43:02+01:00");
  });

  it("uses catalog policy data from pending approval responses", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-1",
          catalog: { id: "catalog-1", name: "Old Policy" },
          currency: { id: "currency-1", code: "GBP" },
          employee_id: "employee-1",
          status: "pending",
          total_amount: 295630,
          items: [
            {
              asset_pricing_id: "price-1",
              kit_item_id: "kit-item-1",
              quantity: 1,
              amount: 2500,
            },
          ],
        },
      ],
    });

    assert.equal(records[0].kitName, undefined);
    assert.equal(records[0].matchedRuleName, "Old Policy");
    assert.equal(records[0].currencyCode, "GBP");
    assert.equal(records[0].totalAmount, 2500);
    assert.equal(records[0].items[0].assetPricingId, "price-1");
    assert.equal(records[0].items[0].kitItemId, "kit-item-1");
    assert.equal(records[0].items[0].amount, 2500);
  });

  it("does not invent approval display values when the API omits them", () => {
    const records = orderRequestListToRecords({
      data: [
        {
          id: "req-1",
          fulfillment: {
            summary: {
              marketplace_count: 0,
              rfq_count: 0,
              storage_count: 0,
            },
          },
          items: [{ kit_item_id: "kit-item-1" }],
        },
      ],
    });

    assert.equal(records[0].employee?.name, undefined);
    assert.equal(records[0].employee?.role, undefined);
    assert.equal(records[0].kitName, undefined);
    assert.equal(records[0].matchedRuleName, undefined);
    assert.equal(records[0].currencySymbol, undefined);
    assert.deepEqual(records[0].fulfillmentSources, []);
    assert.equal(records[0].status, undefined);
    assert.equal(records[0].createdAt, undefined);
    assert.equal(records[0].items[0].name, undefined);
    assert.equal(records[0].items[0].category, undefined);
    assert.equal(records[0].items[0].tier, undefined);
    assert.equal(records[0].items[0].source, undefined);
    assert.equal(records[0].items[0].quantity, undefined);
    assert.equal(records[0].items[0].amount, undefined);
    assert.equal(records[0].items[0].leadTimeDays, undefined);
  });
});

function record(
  id: string,
  employeeId: string,
  name: string,
  status: ApprovalRecord["status"],
): ApprovalRecord {
  return {
    id,
    catalogId: "catalog-1",
    employeeId,
    employee: {
      id: employeeId,
      name,
      initials: name
        .split(" ")
        .map((part) => part[0])
        .join(""),
      role: "Engineer",
      country: "United States",
      level: "L4",
    },
    kitName: "Engineering Starter Kit",
    matchedRuleName: "Engineering Onboarding Policy",
    allowItemSwap: true,
    items: [],
    status,
    createdAt: new Date().toISOString(),
    actionedBy:
      status === "APPROVED"
        ? { admin: "Admin", at: new Date().toISOString() }
        : undefined,
  };
}
