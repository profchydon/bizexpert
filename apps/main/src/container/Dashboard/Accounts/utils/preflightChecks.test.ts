import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ActingAdmin, Subsidiary } from "../types";
import {
  buildCloseOfficeChecks,
  buildCloseSubsidiaryChecks,
  buildCloseSubsidiaryChecksFromFixture,
  canCloseOffice,
  canCloseSubsidiary,
  closureBlockersToFlags,
  confirmSlugMatches,
  toConfirmSlug,
} from "./preflightChecks";

const subsidiary: Subsidiary = {
  id: "sub-1",
  name: "Rayda UK",
  admins: ["Alex Admin"],
};

const globalAdmin: ActingAdmin = {
  role: "global",
  name: "Global Admin",
  administeredEntityIds: [],
  officeIds: [],
};
const entityAdmin: ActingAdmin = {
  role: "subsidiary",
  name: "Alex Admin",
  administeredEntityIds: ["sub-1"],
  officeIds: [],
};
const otherEntityAdmin: ActingAdmin = {
  role: "subsidiary",
  name: "Other Admin",
  administeredEntityIds: ["sub-2"],
  officeIds: [],
};

describe("toConfirmSlug", () => {
  it("replaces spaces with dashes", () => {
    assert.equal(toConfirmSlug("Rayda UK"), "Rayda-UK");
    assert.equal(toConfirmSlug("  Acme Global Ltd  "), "Acme-Global-Ltd");
  });
});

describe("confirmSlugMatches", () => {
  it("matches case-insensitively with trimmed input", () => {
    assert.equal(confirmSlugMatches("rayda-uk", "Rayda-UK"), true);
    assert.equal(confirmSlugMatches("  RAYDA-UK  ", "Rayda-UK"), true);
    assert.equal(confirmSlugMatches("Rayda UK", "Rayda-UK"), false);
  });

  it("rejects empty confirm slugs", () => {
    assert.equal(confirmSlugMatches("anything", ""), false);
  });
});

describe("closureBlockersToFlags", () => {
  it("maps fixture blocker modes to subsidiary blocker flags", () => {
    assert.deepEqual(closureBlockersToFlags("none"), {
      hasActiveOffices: false,
      hasOutstandingReceivables: false,
    });
    assert.deepEqual(closureBlockersToFlags("both"), {
      hasActiveOffices: true,
      hasOutstandingReceivables: true,
    });
  });
});

describe("buildCloseSubsidiaryChecksFromFixture", () => {
  it("blocks offices and AR using fixture modes", () => {
    const checks = buildCloseSubsidiaryChecksFromFixture(
      subsidiary,
      globalAdmin,
      "offices",
    );
    assert.equal(checks[1]?.ok, false);
    assert.equal(checks[2]?.ok, true);
  });
});

describe("buildCloseSubsidiaryChecks", () => {
  it("passes all checks for authorized admin with no blockers", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, globalAdmin, {
      hasActiveOffices: false,
      hasOutstandingReceivables: false,
    });

    assert.equal(
      checks.every((check) => check.ok),
      true,
    );
    assert.equal(canCloseSubsidiary(checks), true);
  });

  it("passes role check for entity admin listed on the subsidiary", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, entityAdmin, {
      hasActiveOffices: false,
      hasOutstandingReceivables: false,
    });

    assert.equal(checks[0]?.ok, true);
  });

  it("blocks closure when admin is not authorized", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, otherEntityAdmin, {
      hasActiveOffices: false,
      hasOutstandingReceivables: false,
    });

    assert.equal(checks[0]?.ok, false);
    assert.equal(canCloseSubsidiary(checks), false);
  });

  it("blocks closure when active offices exist", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, globalAdmin, {
      hasActiveOffices: true,
      hasOutstandingReceivables: false,
    });

    assert.equal(checks[1]?.ok, false);
    assert.match(checks[1]?.blocked ?? "", /Active offices exist/);
    assert.equal(canCloseSubsidiary(checks), false);
  });

  it("blocks closure when outstanding receivables exist", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, globalAdmin, {
      hasActiveOffices: false,
      hasOutstandingReceivables: true,
    });

    assert.equal(checks[2]?.ok, false);
    assert.match(checks[2]?.blocked ?? "", /Outstanding AR/);
    assert.equal(canCloseSubsidiary(checks), false);
  });

  it("reports both office and AR blockers together", () => {
    const checks = buildCloseSubsidiaryChecks(subsidiary, globalAdmin, {
      hasActiveOffices: true,
      hasOutstandingReceivables: true,
    });

    assert.equal(checks[1]?.ok, false);
    assert.equal(checks[2]?.ok, false);
    assert.equal(canCloseSubsidiary(checks), false);
  });
});

describe("buildCloseOfficeChecks", () => {
  it("passes when the office is empty", () => {
    const checks = buildCloseOfficeChecks(0, 0);

    assert.equal(canCloseOffice(checks), true);
  });

  it("blocks closure while employees remain", () => {
    const checks = buildCloseOfficeChecks(1, 0);

    assert.equal(checks[0]?.ok, false);
    assert.match(checks[0]?.blocked ?? "", /1 employee still assigned/);
    assert.equal(canCloseOffice(checks), false);
  });

  it("pluralizes employee blocker copy", () => {
    const checks = buildCloseOfficeChecks(3, 0);

    assert.match(checks[0]?.blocked ?? "", /3 employees still assigned/);
  });

  it("blocks closure while assets remain", () => {
    const checks = buildCloseOfficeChecks(0, 2);

    assert.equal(checks[1]?.ok, false);
    assert.match(checks[1]?.blocked ?? "", /2 assets still here/);
    assert.equal(canCloseOffice(checks), false);
  });

  it("singularizes asset blocker copy", () => {
    const checks = buildCloseOfficeChecks(0, 1);

    assert.match(checks[1]?.blocked ?? "", /1 asset still here/);
  });
});
