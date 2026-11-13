import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("getAssetTypes", () => {
  it("requests GET /assets/types", () => {
    const query = readFileSync(
      "src/api/baseQueries/assetsApi/getAssetTypes.ts",
      "utf8",
    );
    const api = readFileSync("src/api/baseQueries/assetsApi/index.ts", "utf8");

    assert.match(api, /baseUrl: `\$\{config\.API_URL!\}`/);
    assert.match(query, /url: `\/assets\/types`/);
    assert.match(query, /useGetAssetTypesQuery/);
  });
});
