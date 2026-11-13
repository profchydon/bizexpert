import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runWithPending } from "./runWithPending";

describe("runWithPending", () => {
  it("sets pending true for the task and false after it resolves", async () => {
    const seen: boolean[] = [];
    await runWithPending(
      (pending) => seen.push(pending),
      async () => {
        assert.deepEqual(seen, [true]);
      },
    );
    assert.deepEqual(seen, [true, false]);
  });

  it("clears pending when the task throws", async () => {
    const seen: boolean[] = [];
    await assert.rejects(
      () =>
        runWithPending(
          (pending) => seen.push(pending),
          async () => {
            throw new Error("queue failed");
          },
        ),
      /queue failed/,
    );
    assert.deepEqual(seen, [true, false]);
  });
});
