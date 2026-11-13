import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { I_LiveIntegrations } from "@/types/integrations";
import { selectHrisFinchOpenSource } from "./selectHrisFinchOpenSource";

const catalogItem = {
  id: "bamboo-id",
  name: "Bamboo",
  description: "Sync employees",
  slug: "bamboo_hr",
  rank: 1,
  created_at: "",
  status: "Inactive" as const,
};

describe("selectHrisFinchOpenSource", () => {
  it("prefers a live integration when one is already connected", () => {
    const source = selectHrisFinchOpenSource({
      openIntegration: "bamboo_hr",
      companyId: "company-1",
      liveHrisIntegrations: [
        {
          id: "live-1",
          integration: { slug: "bamboo_hr" },
        } as I_LiveIntegrations,
      ],
      integrationsData: [catalogItem],
    });

    assert.equal(source?.kind, "manage");
    assert.equal(source?.kind === "manage" && source.integration.id, "live-1");
  });

  it("falls back to the catalog item when no live row exists", () => {
    const source = selectHrisFinchOpenSource({
      openIntegration: "bamboo_hr",
      companyId: "company-1",
      liveHrisIntegrations: [],
      integrationsData: [catalogItem],
    });

    assert.equal(source?.kind, "connect");
    assert.equal(
      source?.kind === "connect" && source.integration.id,
      "bamboo-id",
    );
  });

  it("returns null when the catalog slug is missing", () => {
    assert.equal(
      selectHrisFinchOpenSource({
        openIntegration: "rippling",
        companyId: "company-1",
        liveHrisIntegrations: [],
        integrationsData: [catalogItem],
      }),
      null,
    );
  });
});
