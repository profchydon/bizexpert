import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import {
  asRedirectUrl,
  openIntegrationRedirect,
} from "./openIntegrationRedirect";

const integrationFiles = [
  "src/container/Dashboard/Settings/Integrations/GoogleWorkspace/index.tsx",
  "src/container/Dashboard/Settings/Integrations/Finch/useFinchConnectActions.ts",
  "src/container/Dashboard/Settings/Integrations/HiBob/index.tsx",
  "src/container/Dashboard/Settings/Integrations/MicrosoftEntraID/index.tsx",
];

describe("asRedirectUrl", () => {
  it("keeps only string urls", () => {
    assert.equal(
      asRedirectUrl("https://accounts.example.com/oauth"),
      "https://accounts.example.com/oauth",
    );
    assert.equal(asRedirectUrl(undefined), undefined);
    assert.equal(asRedirectUrl({ connect_url: "https://x" }), undefined);
  });
});

describe("openIntegrationRedirect", () => {
  it("opens a safe url and rejects an unsafe one", async () => {
    const opened: string[] = [];
    const originalOpen = globalThis.open;

    globalThis.open = ((url?: string | URL) => {
      opened.push(String(url));
      return null;
    }) as typeof globalThis.open;

    try {
      assert.equal(
        await openIntegrationRedirect(
          async () => "https://connect.example.com",
        ),
        true,
      );
      assert.equal(
        await openIntegrationRedirect(async () => "javascript:alert(1)"),
        false,
      );
      assert.deepEqual(opened, ["https://connect.example.com"]);
    } finally {
      globalThis.open = originalOpen;
    }
  });

  it("surfaces a thrown authorization error without opening a window", async () => {
    const originalOpen = globalThis.open;
    let opened = false;

    globalThis.open = (() => {
      opened = true;
      return null;
    }) as typeof globalThis.open;

    try {
      assert.equal(
        await openIntegrationRedirect(async () => {
          throw { data: { message: "Redirect failed" } };
        }),
        false,
      );
      assert.equal(opened, false);
    } finally {
      globalThis.open = originalOpen;
    }
  });
});

describe("integration connect windows", () => {
  it("open only through the shared safe redirect helper", () => {
    integrationFiles.forEach((path) => {
      const source = readFileSync(path, "utf8");
      assert.match(source, /openIntegrationRedirect/, path);
      assert.equal(source.includes("window.open"), false, path);
    });
  });
});
