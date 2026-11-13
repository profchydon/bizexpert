import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "SubsidiaryStatusBanner.tsx"), "utf8");

describe("SubsidiaryStatusBanner closed state", () => {
  it("matches the reference closed-entity callout copy and styling", () => {
    assert.match(source, /title: "This entity is closed"/);
    assert.match(
      source,
      /body: "Its billing cycle has stopped and it can't be billed again\. To resume, create a new entity and migrate its assets\."/,
    );
    assert.match(source, /icon: SlashCircleIcon/);
    assert.match(source, /container: "border-gray-200 bg-gray-50"/);
    assert.match(source, /title: "text-gray-900"/);
    assert.match(source, /body: "text-gray-600"/);
  });

  it("renders no CTA for closed entities", () => {
    assert.doesNotMatch(source, /closed:[\s\S]*?cta:/);
  });

  it("does not render a banner for permanent-card-only entities", () => {
    assert.doesNotMatch(source, /"permanent-card-only":/);
    assert.doesNotMatch(source, /Card-only after repeat suspension/);
  });
});
