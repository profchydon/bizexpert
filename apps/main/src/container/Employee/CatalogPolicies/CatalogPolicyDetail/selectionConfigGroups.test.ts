import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addOpenSelectionCartItem,
  getOpenSelectionGroups,
  getOpenSelectionItems,
  getSelectedOpenSelectionGroup,
  pruneOpenSelectionCart,
} from "./selectionConfigGroups";
import type { PolicyDisplayItem } from "./utils";

const items: PolicyDisplayItem[] = [
  {
    id: "laptop-1",
    name: "Laptop",
    category: "Laptop",
    quantity: 4,
    required: true,
  },
  {
    id: "laptop-2",
    name: "Laptop",
    category: "Laptop",
    quantity: 2,
    required: true,
  },
  {
    id: "workstation-1",
    name: "Workstation",
    category: "Workstation",
    quantity: 3,
    required: true,
  },
  {
    id: "phone-1",
    name: "Phone",
    category: "Tablets/Phones",
    quantity: 2,
    required: true,
  },
];

describe("employee open catalog policy selection groups", () => {
  it("groups items by selection config categories", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [
        { category_id: "laptop-a", category_name: "Laptop", min: 0, max: 1 },
        { category_id: "laptop-b", category_name: "Laptop", min: 0, max: 1 },
        {
          category_id: "workstation",
          category_name: "Workstation",
          min: 0,
          max: 1,
        },
      ],
    });

    assert.deepEqual(
      groups.map((group) => ({
        name: group.name,
        key: group.key,
        max: group.max,
        itemIds: group.items.map((item) => item.id),
        required: group.items.map((item) => item.required),
      })),
      [
        {
          name: "Laptop 1",
          key: "laptop-a",
          max: 1,
          itemIds: ["laptop-1"],
          required: [false],
        },
        {
          name: "Laptop 2",
          key: "laptop-b",
          max: 1,
          itemIds: ["laptop-2"],
          required: [false],
        },
        {
          name: "Workstation",
          key: "workstation",
          max: 1,
          itemIds: ["workstation-1"],
          required: [false],
        },
      ],
    );
  });

  it("caps cart additions by selection category max", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [{ category_name: "Workstation", min: 0, max: 1 }],
    });
    const openItems = getOpenSelectionItems(groups);
    const item = openItems[0];

    let cart = addOpenSelectionCartItem({}, item, openItems);
    cart = addOpenSelectionCartItem(cart, item, openItems);

    assert.deepEqual(cart, { "workstation-1": 1 });
  });

  it("keeps no-limit categories visible and allows uncapped item additions", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [{ category_name: "Laptop", min: null, max: null }],
    });
    const openItems = getOpenSelectionItems(groups);
    const item = openItems[0];

    let cart = addOpenSelectionCartItem({}, item, openItems);
    cart = addOpenSelectionCartItem(cart, item, openItems);
    cart = addOpenSelectionCartItem(cart, item, openItems);
    cart = addOpenSelectionCartItem(cart, item, openItems);
    cart = addOpenSelectionCartItem(cart, item, openItems);

    assert.equal(groups[0].max, null);
    assert.deepEqual(
      groups.map((group) => group.name),
      ["Laptop"],
    );
    assert.deepEqual(cart, { "laptop-1": 5 });
  });

  it("selects the active tab group or falls back to the first group", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [
        { category_id: "laptop", category_name: "Laptop", min: 0, max: 1 },
        {
          category_id: "workstation",
          category_name: "Workstation",
          min: 0,
          max: 1,
        },
      ],
    });

    assert.equal(
      getSelectedOpenSelectionGroup(groups, "workstation").name,
      "Workstation",
    );
    assert.equal(
      getSelectedOpenSelectionGroup(groups, "missing").name,
      "Laptop",
    );
  });

  it("prunes existing carts against open selection limits", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [{ category_name: "Laptop", min: 0, max: 1 }],
    });

    assert.deepEqual(pruneOpenSelectionCart({ "laptop-1": 3 }, groups), {
      "laptop-1": 1,
    });
  });

  it("does not prune no-limit cart quantities by item quantity", () => {
    const groups = getOpenSelectionGroups(items, {
      categories: [{ category_name: "Laptop", min: null, max: null }],
    });

    assert.deepEqual(pruneOpenSelectionCart({ "laptop-1": 5 }, groups), {
      "laptop-1": 5,
    });
  });
});
