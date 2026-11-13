import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { resolveOptionCardAction } from "./optionCardAction";

describe("resolveOptionCardAction", () => {
  it("keeps in-app paths on the router", () => {
    assert.deepEqual(resolveOptionCardAction("/dashboard/storage", "storage"), {
      type: "internal",
      path: "/dashboard/storage",
      storeCountry: false,
    });
    assert.deepEqual(
      resolveOptionCardAction("/dashboard/equip-employee", "onboarding"),
      {
        type: "internal",
        path: "/dashboard/equip-employee",
        storeCountry: true,
      },
    );
  });

  it("opens only absolute http(s) urls, including www hosts", () => {
    assert.deepEqual(
      resolveOptionCardAction("https://vendor.example.com/contract", "storage"),
      {
        type: "external",
        url: "https://vendor.example.com/contract",
      },
    );
    assert.deepEqual(
      resolveOptionCardAction("www.example.com/help", "internet_contract"),
      {
        type: "external",
        url: "https://www.example.com/help",
      },
    );
  });

  it("rejects javascript, protocol-relative, and empty links", () => {
    assert.deepEqual(resolveOptionCardAction(undefined, "storage"), {
      type: "none",
    });
    assert.deepEqual(
      resolveOptionCardAction("javascript:alert(1)", "storage"),
      {
        type: "invalid",
      },
    );
    assert.deepEqual(resolveOptionCardAction("//evil.example", "storage"), {
      type: "invalid",
    });
  });
});

describe("OptionCard click wiring", () => {
  const source = readFileSync(
    "src/container/Dashboard/Overview/ServicesOptions/OptionCard.tsx",
    "utf8",
  );

  it("opens externals through the shared safe helper", () => {
    assert.match(source, /resolveOptionCardAction\(link, slug\)/);
    assert.match(source, /openSafeRedirectUrl\(action\.url\)/);
    assert.equal(source.includes("window.open"), false);
  });
});
