import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("clearCart", () => {
  it("deletes the open cart for the workspace company and user", () => {
    const source = readFileSync(
      join(process.cwd(), "src/api/baseQueries/cartApi/clearCart.ts"),
      "utf8",
    );

    assert.match(source, /method: "DELETE"/);
    assert.match(source, /\/\$\{companyId\}\/carts\/users\/\$\{userId\}/);
    assert.match(source, /invalidatesTags: \["Cart"\]/);
    assert.doesNotMatch(source, /\/items\//);
    assert.doesNotMatch(source, /method: "POST"/);
  });
});
