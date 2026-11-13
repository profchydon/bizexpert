import assert from "node:assert/strict";
import { test } from "node:test";
import { releaseBodyScrollLock } from "./releaseBodyScrollLock";

test("clears stale body scroll lock styles", () => {
  const doc = {
    body: {
      style: {
        overflow: "hidden",
        paddingRight: "15px",
        position: "fixed",
        touchAction: "none",
        width: "100%",
      },
    },
    documentElement: {
      style: {
        overflow: "hidden",
      },
    },
  };

  releaseBodyScrollLock(doc);

  assert.deepEqual(doc, {
    body: {
      style: {
        overflow: "",
        paddingRight: "",
        position: "",
        touchAction: "",
        width: "",
      },
    },
    documentElement: {
      style: {
        overflow: "",
      },
    },
  });
});
