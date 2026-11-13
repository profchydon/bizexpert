import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  entityStatusFilterOptions,
  statusColor,
  statusFilterOptions,
  statusImplication,
  statusLabel,
  statusTooltip,
} from "./badgeTooltips";
import {
  ENTITY_BILLING_STATUS_BADGES,
  SUBSIDIARY_STATUSES,
  isSubsidiaryStatus,
  mapBillingStatusBadge,
  normalizeEntityLifecycleStatus,
} from "./subsidiaryStatus";
import { filterSubsidiaries } from "./sortSubsidiaries";
import type { Subsidiary } from "../types";

const unmappedEntity: Subsidiary = {
  id: "na-1",
  name: "Unknown Status Co",
  region: "Kenya",
  currency: "USD",
  admins: [],
  status: "N/A",
  officesCount: 0,
  creditState: "card-only",
  cardOnFile: false,
  createdDaysAgo: 1,
  createdBy: "Admin",
  billingMode: "self",
  billingEntityId: "na-1",
  billingEntityName: "Unknown Status Co",
  billingCurrency: "USD",
};

describe("subsidiaryStatus registry", () => {
  it("maps every API billing_status_badge to a filterable subsidiary status", () => {
    for (const badge of ENTITY_BILLING_STATUS_BADGES) {
      assert.notEqual(
        mapBillingStatusBadge(badge, "active", false),
        "N/A",
        `expected ${badge} to map to a known status`,
      );
    }
  });

  it("maps unknown badges to N/A", () => {
    assert.equal(mapBillingStatusBadge("unexpected", "active", false), "N/A");
  });

  it("maps closed lifecycle statuses regardless of casing or separators", () => {
    assert.equal(
      mapBillingStatusBadge("operational", "Closed", false),
      "closed",
    );
    assert.equal(mapBillingStatusBadge("delegated", "closed", false), "closed");
    assert.equal(normalizeEntityLifecycleStatus(" Closed "), "closed");
  });

  it("keeps entity filter options aligned with filterable subsidiary statuses", () => {
    assert.deepEqual(
      entityStatusFilterOptions.map((option) => option.id),
      SUBSIDIARY_STATUSES.filter((status) => status !== "N/A"),
    );
    assert.deepEqual(
      entityStatusFilterOptions.map((option) => option.label),
      SUBSIDIARY_STATUSES.filter((status) => status !== "N/A").map(
        (status) => statusLabel[status],
      ),
    );
  });

  it("defines labels, colors, and tooltips for every subsidiary status", () => {
    for (const status of SUBSIDIARY_STATUSES) {
      assert.ok(statusLabel[status]);
      assert.ok(statusColor[status]);
      assert.ok(statusTooltip[status]);
      assert.ok(statusImplication[status]);
      assert.equal(isSubsidiaryStatus(status), true);
    }
  });

  it("filters entities by N/A status", () => {
    const filtered = filterSubsidiaries([unmappedEntity], "", ["N/A"]);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.status, "N/A");
  });
});
