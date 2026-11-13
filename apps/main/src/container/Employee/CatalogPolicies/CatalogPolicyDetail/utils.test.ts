import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addPolicyCartItem,
  buildPolicyOrderRequestPayload,
  filterPolicyItemsByRequirement,
  getPolicyCartItems,
  getPolicyCartCount,
  getPolicyItems,
  prunePolicyCart,
  reducePolicyCartItem,
  syncRequiredPolicyCart,
  titleCase,
} from "./utils";
import {
  hasApprovedCatalogPolicyOrder,
  hasPendingCatalogPolicyOrder,
  isApprovedCatalogPolicyOrder,
  isPendingCatalogPolicyOrder,
} from "../pendingOrder";

describe("employee catalog policy detail utils", () => {
  it("builds display items from kit items", () => {
    const items = getPolicyItems([
      {
        id: "kit-1",
        name: "Starter Kit",
        items: {
          data: [
            {
              id: "item-1",
              asset_specification_id: "spec-1",
              quantity: 2,
              required: true,
              sort_order: 1,
              created_at: "",
              updated_at: "",
              asset_specification: {
                name: "Laptop",
                category: "Workstation",
                images: ["image.png"],
                spec: { ram: "16GB", storage: "512GB" },
              },
            },
          ],
        },
      },
    ]);

    assert.equal(items[0].name, "Laptop");
    assert.equal(items[0].quantity, 2);
    assert.equal(items[0].kitName, "Starter Kit");
    assert.equal(items[0].specs, "16GB 512GB");
    assert.equal(items[0].required, true);
  });

  it("builds display items from kit item summaries", () => {
    const items = getPolicyItems([
      {
        id: "kit-1",
        name: "Starter Kit",
        items_count: 1,
        items_summary: [{ name: "Laptop", images: ["image.png"], quantity: 1 }],
      },
    ]);

    assert.deepEqual(items[0], {
      id: "kit-1-0",
      name: "Laptop",
      image: "image.png",
      quantity: 1,
      kitName: "Starter Kit",
    });
  });

  it("capitalizes policy labels", () => {
    assert.equal(titleCase("fixed"), "Fixed");
    assert.equal(titleCase(null), "Not available");
  });

  it("caps cart quantity at the available item quantity", () => {
    let cart = addPolicyCartItem({}, "item-1", 2);
    cart = addPolicyCartItem(cart, "item-1", 2);
    cart = addPolicyCartItem(cart, "item-1", 2);

    assert.deepEqual(cart, { "item-1": 2 });
    assert.equal(getPolicyCartCount(cart), 2);
  });

  it("removes items when reducing below one", () => {
    const cart = reducePolicyCartItem({ "item-1": 1 }, "item-1");

    assert.deepEqual(cart, {});
  });

  it("prunes selected quantities against available dashboard items", () => {
    const cart = prunePolicyCart({ "item-1": 3, "item-2": 1 }, [
      {
        id: "item-1",
        name: "Laptop",
        quantity: 2,
      },
    ]);

    assert.deepEqual(cart, { "item-1": 2 });
  });

  it("auto-adds required items to the policy cart", () => {
    const cart = syncRequiredPolicyCart({ "optional-item": 1 }, [
      { id: "required-item", name: "Laptop", quantity: 2, required: true },
      { id: "optional-item", name: "Phone", quantity: 3 },
    ]);

    assert.deepEqual(cart, { "optional-item": 1, "required-item": 2 });
  });

  it("filters policy items by requirement", () => {
    const items = [
      { id: "required-item", name: "Laptop", quantity: 1, required: true },
      { id: "optional-item", name: "Phone", quantity: 1 },
    ];

    assert.deepEqual(filterPolicyItemsByRequirement(items, "all"), items);
    assert.deepEqual(filterPolicyItemsByRequirement(items, "required"), [
      items[0],
    ]);
    assert.deepEqual(filterPolicyItemsByRequirement(items, "optional"), [
      items[1],
    ]);
  });

  it("returns selected cart item details for the drawer", () => {
    const cartItems = getPolicyCartItems({ "item-1": 2 }, [
      {
        id: "item-1",
        name: "Laptop",
        quantity: 3,
      },
      {
        id: "item-2",
        name: "Phone",
        quantity: 1,
      },
    ]);

    assert.deepEqual(cartItems, [
      {
        item: {
          id: "item-1",
          name: "Laptop",
          quantity: 3,
        },
        quantity: 2,
      },
    ]);
  });

  it("builds the order request payload from selected kit items", () => {
    const payload = buildPolicyOrderRequestPayload({
      cart: { "kit-item-1": 2 },
      departmentId: "department-1",
      items: [
        {
          id: "kit-item-1",
          name: "Laptop",
          quantity: 3,
        },
      ],
    });

    assert.deepEqual(payload, {
      department_id: "department-1",
      order_note: "",
      items: [{ kit_item_id: "kit-item-1", quantity: 2 }],
    });
  });

  it("detects pending catalog policy orders without blocking reviewed orders", () => {
    assert.equal(isPendingCatalogPolicyOrder({ status: "pending" }), true);
    assert.equal(
      isPendingCatalogPolicyOrder({ status: "awaiting_approval" }),
      true,
    );
    assert.equal(isPendingCatalogPolicyOrder({ status: "awaiting_rfq" }), true);
    assert.equal(isPendingCatalogPolicyOrder({ status: "approved" }), false);
    assert.equal(
      hasPendingCatalogPolicyOrder({
        data: [
          { id: "order-1", status: "approved" },
          { id: "order-2", status: "pending" },
        ],
      }),
      true,
    );
    assert.equal(
      hasPendingCatalogPolicyOrder({
        data: [{ id: "order-1", status: "rejected" }],
      }),
      false,
    );
  });

  it("detects approved catalog policy orders as one-time request blockers", () => {
    assert.equal(isApprovedCatalogPolicyOrder({ status: "approved" }), true);
    assert.equal(isApprovedCatalogPolicyOrder({ status: "placed" }), true);
    assert.equal(isApprovedCatalogPolicyOrder({ status: "pending" }), false);
    assert.equal(
      hasApprovedCatalogPolicyOrder({
        data: [
          { id: "order-1", status: "rejected" },
          { id: "order-2", status: "approved" },
        ],
      }),
      true,
    );
    assert.equal(
      hasApprovedCatalogPolicyOrder({
        data: [{ id: "order-1", status: "rejected" }],
      }),
      false,
    );
  });
});
