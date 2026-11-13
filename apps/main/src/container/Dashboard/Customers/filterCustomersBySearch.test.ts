import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "@/types/bizexpert";
import { filterCustomersBySearch } from "./filterCustomersBySearch";

const rows: Customer[] = [
  {
    id: "1",
    businessId: "b",
    name: "Adaeze Okonkwo",
    phone: "08011112222",
    email: "ada@shop.com",
    creditLimit: 0,
    walletBalance: 0,
    outstandingBalance: 0,
    isActive: true,
    saleCount: 0,
    totalSpent: 0,
  },
  {
    id: "2",
    businessId: "b",
    name: "Bola Ahmed",
    phone: "08033334444",
    creditLimit: 0,
    walletBalance: 0,
    outstandingBalance: 0,
    isActive: true,
    saleCount: 0,
    totalSpent: 0,
  },
];

test("filterCustomersBySearch matches name phone and email", () => {
  assert.equal(filterCustomersBySearch(rows, "adaeze").length, 1);
  assert.equal(filterCustomersBySearch(rows, "0803").length, 1);
  assert.equal(filterCustomersBySearch(rows, "shop.com").length, 1);
  assert.equal(filterCustomersBySearch(rows, "").length, 2);
});
