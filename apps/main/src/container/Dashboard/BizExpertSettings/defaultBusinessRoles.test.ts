import assert from "node:assert/strict";
import { test } from "node:test";
import type { BusinessMember } from "@/types/bizexpert";
import {
  buildManageRoleRows,
  DEFAULT_BUSINESS_ROLES,
  filterManageRoles,
  memberDisplayName,
  membersForRole,
} from "./defaultBusinessRoles";

const members: BusinessMember[] = [
  {
    id: "m1",
    userId: "u1",
    role: "owner",
    isActive: true,
    user: {
      id: "u1",
      name: "Ada",
      email: "ada@demo.bizexpert.ng",
      isActive: true,
    },
  },
  {
    id: "m2",
    userId: "u2",
    role: "cashier",
    isActive: true,
    user: {
      id: "u2",
      name: "",
      email: "till@demo.bizexpert.ng",
      isActive: true,
    },
  },
];

test("catalog is the eleven Lumi default roles", () => {
  assert.deepEqual(
    DEFAULT_BUSINESS_ROLES.map((role) => role.id),
    [
      "owner",
      "admin",
      "business_manager",
      "store_keeper",
      "developer",
      "customer_support",
      "waybill_manager",
      "sales_cashier",
      "cashier",
      "store_manager",
      "accountant",
    ],
  );
  assert.equal(
    DEFAULT_BUSINESS_ROLES.every((role) => role.isDefault),
    true,
  );
});

test("builds member counts and filters default roles", () => {
  const rows = buildManageRoleRows(members);
  assert.equal(rows.find((row) => row.id === "owner")?.memberCount, 1);
  assert.equal(rows.find((row) => row.id === "admin")?.memberCount, 0);
  assert.equal(rows.find((row) => row.id === "cashier")?.memberCount, 1);
  assert.equal(filterManageRoles(rows, "owner").length, 1);
  assert.equal(filterManageRoles(rows, "store keeper").length, 1);
  assert.equal(filterManageRoles(rows, "attendant").length, 0);
});

test("lists members for a role and prefers a name", () => {
  assert.equal(membersForRole(members, "admin").length, 0);
  assert.equal(memberDisplayName(members[0]!), "Ada");
  assert.equal(memberDisplayName(members[1]!), "till@demo.bizexpert.ng");
});
