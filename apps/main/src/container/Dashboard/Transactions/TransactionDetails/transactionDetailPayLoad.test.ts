import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { join } from "node:path";
import { keepPaymentLoad } from "./useTrackedPaymentAssign";

test("the first pay click starts the load and later clicks keep it", () => {
  const started = keepPaymentLoad(null, "https://checkout.stripe.com/pay/1");

  assert.equal(started, "https://checkout.stripe.com/pay/1");
  assert.equal(
    keepPaymentLoad(started, "https://checkout.stripe.com/pay/2"),
    started,
  );
});

test("Click to pay stays loading until the payment link is assigned", () => {
  const actions = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionDetailActions.tsx",
    ),
    "utf8",
  );
  const load = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Transactions/TransactionDetails/useTrackedPaymentAssign.ts",
    ),
    "utf8",
  );

  assert.match(actions, /isLoading=\{isPaying\}/);
  assert.match(actions, /isDisabled=\{[^}]*isPaying/);
  assert.match(actions, /startPayment\(click\.url\)/);
  assert.doesNotMatch(actions, /location\.assign/);
  assert.match(load, /useEffect/);
  assert.match(load, /globalThis\.location\.assign\(payUrl\)/);
  assert.match(load, /isPaying: payUrl !== null/);
});
