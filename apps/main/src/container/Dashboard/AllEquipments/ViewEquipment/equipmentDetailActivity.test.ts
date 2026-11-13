import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { transformEquipmentActivities } from "./equipmentActivityTransform";
import { EQUIPMENT_DETAIL_EMPTY_VALUE } from "./equipmentDetailEmptyValue";
import { getEquipmentTypeIcon } from "./equipmentTypeIcons";

describe("equipment activity transform", () => {
  it("maps assigned events with equipment and assignee highlights", () => {
    const [item] = transformEquipmentActivities(
      [
        {
          id: "1",
          event_type: "assigned",
          event_date: "2026-07-23T16:35:00Z",
          equipment: "HP-PROBK-3J9P7M",
          actor: "Joe Andy",
          payload: null,
          assignee: { id: "a1", name: "State Tow" },
        },
      ],
      "Administrator",
    );

    assert.equal(item.userName, "Joe Andy");
    assert.equal(item.action, "assigned equipment");
    assert.match(item.details, /HP-PROBK-3J9P7M/);
    assert.equal(item.assigneeName, "State Tow");
  });
});

describe("equipment detail empty values", () => {
  it("uses an em dash for missing detail values", () => {
    assert.equal(EQUIPMENT_DETAIL_EMPTY_VALUE, "—");
  });
});

describe("equipment type icons", () => {
  it("resolves distinct icons for laptop and phone types", () => {
    const phoneIcon = getEquipmentTypeIcon("phone");
    const laptopIcon = getEquipmentTypeIcon("laptop/workstation");

    assert.notEqual(phoneIcon, laptopIcon);
    assert.equal(getEquipmentTypeIcon("unknown"), laptopIcon);
  });
});

describe("equipment activity item wiring", () => {
  it("uses reference-aligned activity item instead of legacy ActivityItem", () => {
    const recentActivity = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDetail/EquipmentRecentActivity.tsx",
      ),
      "utf8",
    );
    const activityItem = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDetail/EquipmentActivityItem.tsx",
      ),
      "utf8",
    );

    assert.match(recentActivity, /EquipmentActivityItem/);
    assert.doesNotMatch(recentActivity, /@\/components\/ActivityItem/);
    assert.match(activityItem, /@\/components\/base\/avatar\/avatar/);
    assert.match(activityItem, /bg-border-secondary/);
    assert.match(activityItem, /text-brand-secondary/);
  });
});
