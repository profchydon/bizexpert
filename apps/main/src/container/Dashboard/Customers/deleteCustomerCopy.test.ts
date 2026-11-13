import assert from "node:assert/strict";
import { test } from "node:test";
import {
  customerDeleteDescription,
  customerDeleteTitle,
} from "./deleteCustomerCopy";

test("delete customer copy names the customer", () => {
  assert.equal(customerDeleteTitle(), "Delete customer");
  assert.equal(
    customerDeleteDescription("Adaeze"),
    "This will remove Adaeze from your customer list. Past sales stay on record.",
  );
});
