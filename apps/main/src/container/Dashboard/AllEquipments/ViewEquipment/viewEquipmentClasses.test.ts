import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  getEquipmentStatusBandClass,
  shouldShowEquipmentAssignee,
} from "./equipmentAssetState";
import {
  viewEquipmentDetailCardClass,
  viewEquipmentDeviceCardClass,
  viewEquipmentPageClass,
  viewEquipmentSupportCardClass,
} from "./viewEquipmentClasses";

const viewEquipmentRoot = join(
  process.cwd(),
  "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout",
);

describe("equipment asset state bands", () => {
  it("maps lifecycle statuses to utility theme bands", () => {
    assert.equal(
      getEquipmentStatusBandClass("assigned"),
      "bg-utility-success-50 text-utility-success-700",
    );
    assert.equal(
      getEquipmentStatusBandClass("in_storage"),
      "bg-utility-blue-50 text-utility-blue-700",
    );
    assert.equal(
      getEquipmentStatusBandClass("sold"),
      "bg-utility-purple-50 text-utility-purple-700",
    );
  });

  it("shows assignee only for active assignment states", () => {
    assert.equal(shouldShowEquipmentAssignee("assigned"), true);
    assert.equal(shouldShowEquipmentAssignee("active"), true);
    assert.equal(shouldShowEquipmentAssignee("in_storage"), false);
    assert.equal(shouldShowEquipmentAssignee("unassigned"), false);
  });
});

describe("view equipment design-ui classes", () => {
  it("exports reference card and tab shell tokens", () => {
    assert.match(
      viewEquipmentDeviceCardClass,
      /rounded-xl border border-secondary/,
    );
    assert.match(viewEquipmentDetailCardClass, /shadow-xs/);
    assert.match(
      viewEquipmentSupportCardClass,
      /rounded-xl border border-secondary/,
    );
  });
});

describe("view equipment layout wiring", () => {
  it("uses ViewEquipmentDetailCard on overview tab sections", () => {
    const files = [
      "EquipmentDetail/EquipmentOverview.tsx",
      "EquipmentDetail/EquipmentAssetStatus.tsx",
      "EquipmentDetail/EquipmentRecentActivity.tsx",
    ];

    for (const file of files) {
      const source = readFileSync(join(viewEquipmentRoot, file), "utf8");
      assert.match(source, /ViewEquipmentDetailCard/);
      assert.doesNotMatch(source, /shadow-lg/);
    }
  });

  it("uses EquipmentDetailTabs with application button-border tabs", () => {
    const tabs = readFileSync(
      join(viewEquipmentRoot, "EquipmentTabs.tsx"),
      "utf8",
    );
    const detailTabs = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailTabs.tsx",
      ),
      "utf8",
    );

    assert.match(tabs, /EquipmentDetailTabs/);
    assert.match(detailTabs, /type="button-border"/);
    assert.doesNotMatch(tabs, /TabsTrigger/);
  });

  it("uses base dropdown actions on the equipment rail", () => {
    const actions = readFileSync(
      join(viewEquipmentRoot, "EquipmentSidebar/EquipmentDetailsActions.tsx"),
      "utf8",
    );

    assert.match(actions, /Dropdown\.Root/);
    assert.match(actions, /@\/components\/base\/buttons\/button/);
  });

  it("uses BadgeWithDot support card styling", () => {
    const support = readFileSync(
      join(process.cwd(), "src/components/SupportSection.tsx"),
      "utf8",
    );

    assert.match(support, /BadgeWithDot/);
    assert.match(support, /viewEquipmentSupportCardClass/);
    assert.match(support, /Mail01/);
  });

  it("uses secondary subtle page background on view equipment", () => {
    assert.match(viewEquipmentPageClass, /bg-gray-25/);
    assert.match(viewEquipmentPageClass, /sm:pt-12 sm:pb-24/);
  });

  it("overview and sidebar avoid legacy shadcn badges for missing values", () => {
    const overview = readFileSync(
      join(viewEquipmentRoot, "EquipmentDetail/EquipmentOverview.tsx"),
      "utf8",
    );
    const sidebarInfo = readFileSync(
      join(viewEquipmentRoot, "EquipmentSidebar/EquipmentInfo.tsx"),
      "utf8",
    );

    assert.doesNotMatch(overview, /@\/components\/ui\/badge/);
    assert.doesNotMatch(sidebarInfo, /@\/components\/ui\/badge/);
    assert.match(
      overview,
      /equipmentDetailMissingValue|EQUIPMENT_DETAIL_EMPTY_VALUE/,
    );
  });
});
