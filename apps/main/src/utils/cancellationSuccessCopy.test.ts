import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cancellationSuccessCopy } from "./cancellationSuccessCopy";

describe("cancellationSuccessCopy", () => {
  it("explains a refund on hold after instant cancel", () => {
    const copy = cancellationSuccessCopy(true, "on_hold");

    assert.equal(copy.title, "Cancellation confirmed");
    assert.match(copy.body, /refund is on hold/);
  });

  it("keeps the calculated-refund copy when instant cancel is not on hold", () => {
    const copy = cancellationSuccessCopy(true, "completed");

    assert.match(copy.body, /eligible refund has been calculated/);
  });

  it("keeps the request-submitted copy when cancel is not instant", () => {
    const copy = cancellationSuccessCopy(false, "on_hold");

    assert.equal(copy.title, "Successfully requested for cancellation");
    assert.match(copy.body, /submitted to an admin/);
  });
});
