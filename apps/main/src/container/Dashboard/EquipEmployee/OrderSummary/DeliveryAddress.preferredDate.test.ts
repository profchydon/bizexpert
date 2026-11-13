import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "DeliveryAddress.tsx"), "utf8");

describe("order summary preferred delivery date", () => {
  it("renders fulfilment_date beside Country", () => {
    assert.match(source, /title="Preferred delivery date"/);
    assert.match(source, /data\?\.fulfilment_date/);
    assert.match(source, /formatPreferredDate\(data\?\.fulfilment_date\)/);
  });

  it("keeps Office full width so the date shares the Country row", () => {
    assert.match(
      source,
      /isOfficeDelivery && data\?\.office\?\.name && \([\s\S]*className="col-span-2"[\s\S]*title="Office"/,
    );
  });

  it("explains the date with the preferred-date tooltip", () => {
    assert.match(source, /help=\{PREFERRED_DATE_HELP\}/);
    assert.match(source, /title=\{help\.title\}/);
    assert.match(source, /description=\{help\.description\}/);
  });

  it("omits the field for storage destinations", () => {
    assert.match(
      source,
      /showPreferredDeliveryDate\(data\?\.destination_type\)/,
    );
  });
});
