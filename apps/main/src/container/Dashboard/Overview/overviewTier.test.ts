import assert from "node:assert/strict";
import { test } from "node:test";
import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import {
  entityOverviewSubtitle,
  officeOverviewSubtitle,
  pickOfficeOverviewTarget,
  resolveOverviewTier,
} from "./overviewTier";

test("resolveOverviewTier maps admin and workspace to dashboard layout", () => {
  assert.equal(
    resolveOverviewTier({
      isGlobalAdmin: true,
      activeEntityId: null,
      actingRole: "global",
      officeAdminOfficeIds: [],
    }),
    "global",
  );
  assert.equal(
    resolveOverviewTier({
      isGlobalAdmin: true,
      activeEntityId: "ent-1",
      actingRole: "global",
      officeAdminOfficeIds: [],
    }),
    "entity",
  );
  assert.equal(
    resolveOverviewTier({
      isGlobalAdmin: false,
      activeEntityId: "ent-1",
      actingRole: "entity",
      officeAdminOfficeIds: [],
    }),
    "entity",
  );
  assert.equal(
    resolveOverviewTier({
      isGlobalAdmin: false,
      activeEntityId: "ent-1",
      actingRole: "office",
      officeAdminOfficeIds: ["off-1"],
    }),
    "office",
  );
});

test("pickOfficeOverviewTarget uses the first assigned office membership", () => {
  const access = {
    memberships: [
      {
        id: "ent-9",
        name: "Kenya",
        is_primary: false,
        country: "KE",
        parent_company_id: null,
        role: "Administrator",
        scope: "office",
        office_ids: ["off-a", "off-b"],
        via_global_admin: false,
      },
    ],
    officeAdminOfficeIds: ["off-a", "off-b"],
  } as Pick<AccessContext, "memberships" | "officeAdminOfficeIds">;

  assert.deepEqual(pickOfficeOverviewTarget(access as AccessContext), {
    companyId: "ent-9",
    officeId: "off-a",
  });
});

test("scoped overview subtitles name the country, currency, and parent", () => {
  assert.equal(
    entityOverviewSubtitle("United Kingdom", "GBP"),
    "Country view for United Kingdom. Billed in GBP.",
  );
  assert.equal(
    officeOverviewSubtitle("Acme UK", "United Kingdom"),
    "Office view. Part of Acme UK, United Kingdom.",
  );
});
