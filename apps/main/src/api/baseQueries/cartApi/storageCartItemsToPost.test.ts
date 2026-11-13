import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { storageCartItemsToPost } from "./storageCartItemsToPost";

const deploy = (equipment_id: string) => ({
  type: "storage_deploy_to_employee" as const,
  equipment_id,
  company_id: "co-1",
  employee_id: "emp-1",
});

describe("storageCartItemsToPost", () => {
  it("drops equipment that already has a storage action in the cart", () => {
    const posted = storageCartItemsToPost(
      [deploy("eq-1"), deploy("eq-2")],
      [
        {
          type: "storage_deploy_to_employee",
          equipment_id: "eq-1",
        },
      ],
    );

    assert.deepEqual(posted, [deploy("eq-2")]);
  });

  it("posts every item when the cart has no storage actions", () => {
    const items = [deploy("eq-1"), deploy("eq-2")];
    assert.deepEqual(storageCartItemsToPost(items, []), items);
    assert.deepEqual(storageCartItemsToPost(items, undefined), items);
  });

  it("posts nothing when every selected device is already in the cart", () => {
    assert.deepEqual(
      storageCartItemsToPost(
        [deploy("eq-1")],
        [{ type: "storage_deploy_to_employee", equipment_id: "eq-1" }],
      ),
      [],
    );
  });
});
