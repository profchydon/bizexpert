import assert from "node:assert/strict";
import { describe, it } from "node:test";
import routes from "@/routes";
import {
  resolveCartDomain,
  shouldClearMarketplaceCart,
  shouldClearStorageCart,
} from "./cartDomain";

describe("cartDomain", () => {
  it("classifies storage and marketplace routes", () => {
    assert.equal(resolveCartDomain(routes.STORAGE), "storage");
    assert.equal(resolveCartDomain(`${routes.STORAGE}/import`), "storage");
    assert.equal(
      resolveCartDomain(routes.EQUIP_EMPLOYEE_MARKETPLACE),
      "marketplace",
    );
    assert.equal(
      resolveCartDomain(`${routes.EQUIP_EMPLOYEE_MARKETPLACE}/abc`),
      "marketplace",
    );
    assert.equal(resolveCartDomain(routes.OVERVIEW), "other");
    assert.equal(resolveCartDomain(routes.EQUIP_EMPLOYEE_EMPLOYEES), "other");
  });

  it("clears marketplace cart only when entering storage", () => {
    assert.equal(shouldClearMarketplaceCart(null, "storage"), true);
    assert.equal(shouldClearMarketplaceCart("other", "storage"), true);
    assert.equal(shouldClearMarketplaceCart("marketplace", "storage"), true);
    assert.equal(shouldClearMarketplaceCart("storage", "storage"), false);
  });

  it("clears storage cart only when entering marketplace", () => {
    assert.equal(shouldClearStorageCart(null, "marketplace"), true);
    assert.equal(shouldClearStorageCart("other", "marketplace"), true);
    assert.equal(shouldClearStorageCart("storage", "marketplace"), true);
    assert.equal(shouldClearStorageCart("marketplace", "marketplace"), false);
  });
});
