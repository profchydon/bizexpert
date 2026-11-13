import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { transitionNavigate } from "./transitionNavigate";

describe("transitionNavigate", () => {
  it("runs navigation inside startTransition", () => {
    let ranTransition = false;
    let navigated = false;

    transitionNavigate(
      (callback) => {
        ranTransition = true;
        callback();
      },
      () => {
        navigated = true;
      },
    );

    assert.equal(ranTransition, true);
    assert.equal(navigated, true);
  });
});
