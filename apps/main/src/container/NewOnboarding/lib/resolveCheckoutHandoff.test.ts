import { strict as assert } from "node:assert";
import { test } from "node:test";
import { resolveCheckoutHandoff } from "./resolveCheckoutHandoff";

test("a checkout link is a redirect", () => {
  assert.equal(
    resolveCheckoutHandoff({
      data: {
        collection: { link: "https://pay.example/session" },
      },
    }),
    "redirected",
  );
});

test("an applied collection with no link does not skip payment", () => {
  assert.equal(
    resolveCheckoutHandoff({
      data: { collection: { link: null, status: "applied" } },
    }),
    "failed",
  );
});

test("a zero quote with no link does not skip payment", () => {
  assert.equal(
    resolveCheckoutHandoff({
      data: {
        collection: { link: null },
        quote: { requires_payment: false },
      },
    }),
    "failed",
  );
});

test("pending payment without a link is a failure", () => {
  assert.equal(
    resolveCheckoutHandoff({
      data: { collection: { link: null, status: "pending_payment" } },
    }),
    "failed",
  );
});

test("an empty change-plan body is a failure", () => {
  assert.equal(resolveCheckoutHandoff({}), "failed");
});
