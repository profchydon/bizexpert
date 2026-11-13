import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { WORK_STARTED_NOTICE } from "./WorkStartedNotice";

const read = (file: string) =>
  readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Orders/ViewOrder/v2/cancel",
      file,
    ),
    "utf8",
  );

describe("work started notice", () => {
  it("tells the customer not to expect a full refund after work has started", () => {
    assert.match(
      WORK_STARTED_NOTICE,
      /You should not expect a full refund if this cancellation is approved/,
    );
  });

  it("shows the notice on the confirm step after a vendor has accepted", () => {
    const confirm = read("CancelConfirmStep.tsx");
    assert.match(confirm, /WorkStartedNotice/);
    assert.match(confirm, /!isPreAccept && <WorkStartedNotice/);
  });
});
