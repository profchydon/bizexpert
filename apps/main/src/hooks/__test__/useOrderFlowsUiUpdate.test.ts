import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { useOrderFlowsUiUpdate } from "@/hooks/useOrderFlowsUiUpdate";

describe("useOrderFlowsUiUpdate", () => {
  it("always enables the updated order flows", () => {
    assert.deepEqual(useOrderFlowsUiUpdate(), {
      enabled: true,
      resolved: true,
    });
  });
});
