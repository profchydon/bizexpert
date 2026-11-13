import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "@/types/bizexpert";
import {
  customerFormSchema,
  toCustomerPayload,
  valuesFromCustomer,
} from "./customerSchema";

const sample: Customer = {
  id: "c1",
  businessId: "b1",
  name: "Adaeze",
  phone: "08011112222",
  email: "ada@example.com",
  address: "Lekki",
  notes: "",
  creditLimit: "50000",
  walletBalance: 0,
  outstandingBalance: 0,
  isActive: true,
  saleCount: 0,
  totalSpent: 0,
};

test("toCustomerPayload drops blank optional fields", () => {
  const payload = toCustomerPayload({
    name: "  Adaeze  ",
    phone: "  ",
    email: "",
    address: " Lekki ",
    notes: "",
    creditLimit: 25000,
  });
  assert.equal(payload.name, "Adaeze");
  assert.equal(payload.phone, undefined);
  assert.equal(payload.email, undefined);
  assert.equal(payload.address, "Lekki");
  assert.equal(payload.creditLimit, 25000);
});

test("valuesFromCustomer maps API decimals for the form", () => {
  const values = valuesFromCustomer(sample);
  assert.equal(values.name, "Adaeze");
  assert.equal(values.creditLimit, 50000);
});

test("customerFormSchema rejects a blank name", () => {
  const parsed = customerFormSchema.safeParse({
    name: " ",
    creditLimit: 0,
  });
  assert.equal(parsed.success, false);
});
