import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const heavyRoutes = [
  "src/app/dashboard/orders/loading.tsx",
  "src/app/dashboard/storage/loading.tsx",
  "src/app/dashboard/catalogs/loading.tsx",
  "src/app/dashboard/settings/loading.tsx",
];

describe("heavy dashboard route loading", () => {
  for (const path of heavyRoutes) {
    it(`shows RouteLoading for ${path}`, () => {
      const source = read(path);
      assert.match(source, /RouteLoading/);
      assert.match(source, /export default function Loading/);
    });
  }
});
