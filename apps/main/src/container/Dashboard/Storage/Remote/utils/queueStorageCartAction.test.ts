import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("queueStorageCartAction", () => {
  it("only closes the action after the cart POST succeeds", () => {
    const helper = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/utils/queueStorageCartAction.ts",
      ),
      "utf8",
    );
    const flow = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStoragePageCartFlow.ts",
      ),
      "utf8",
    );

    assert.match(helper, /await addCartActions\(items\)/);
    assert.match(helper, /onSuccess\(\)/);
    assert.match(helper, /catch \(error\)/);
    assert.match(helper, /onError\?\.\(error\)/);
    assert.doesNotMatch(helper, /\.then\(/);
    assert.match(flow, /queueStorageCartAction\(/);
    assert.doesNotMatch(flow, /addCartActions\(/);
    assert.match(flow, /setCartActionError\(description \|\| title\)/);
    assert.doesNotMatch(flow, /notify\(title, description/);
  });
});
