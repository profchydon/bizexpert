import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assignSafeRedirectUrl,
  isSafeRedirectUrl,
  openSafeRedirectUrl,
} from "./isSafeRedirectUrl";

describe("isSafeRedirectUrl", () => {
  it("accepts absolute http and https urls", () => {
    assert.equal(isSafeRedirectUrl("https://accounts.example.com/oauth"), true);
    assert.equal(isSafeRedirectUrl("http://localhost:3000/auth"), true);
  });

  it("rejects missing, relative, and non-http schemes", () => {
    assert.equal(isSafeRedirectUrl(undefined), false);
    assert.equal(isSafeRedirectUrl(""), false);
    assert.equal(isSafeRedirectUrl("/auth/callback"), false);
    assert.equal(isSafeRedirectUrl("javascript:alert(1)"), false);
    assert.equal(isSafeRedirectUrl("data:text/html,hi"), false);
    assert.equal(isSafeRedirectUrl("not a url"), false);
  });
});

describe("assignSafeRedirectUrl", () => {
  it("assigns only when the url is a safe http(s) address", () => {
    const assigned: string[] = [];
    const original = globalThis.location;

    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: {
        assign: (url: string) => {
          assigned.push(url);
        },
      },
    });

    try {
      assert.equal(assignSafeRedirectUrl("javascript:alert(1)"), false);
      assert.equal(
        assignSafeRedirectUrl("https://accounts.example.com/oauth"),
        true,
      );
      assert.deepEqual(assigned, ["https://accounts.example.com/oauth"]);
    } finally {
      Object.defineProperty(globalThis, "location", {
        configurable: true,
        value: original,
      });
    }
  });
});

describe("openSafeRedirectUrl", () => {
  it("opens only safe http(s) urls with noopener", () => {
    const opened: Array<{ url: string; target: string; features: string }> = [];
    const originalOpen = globalThis.open;

    globalThis.open = ((
      url?: string | URL,
      target?: string,
      features?: string,
    ) => {
      opened.push({
        url: String(url),
        target: target ?? "",
        features: features ?? "",
      });
      return null;
    }) as typeof globalThis.open;

    try {
      assert.equal(openSafeRedirectUrl("javascript:alert(1)"), false);
      assert.equal(
        openSafeRedirectUrl("https://connect.example.com/oauth"),
        true,
      );
      assert.deepEqual(opened, [
        {
          url: "https://connect.example.com/oauth",
          target: "_blank",
          features: "noopener,noreferrer",
        },
      ]);
    } finally {
      globalThis.open = originalOpen;
    }
  });
});
