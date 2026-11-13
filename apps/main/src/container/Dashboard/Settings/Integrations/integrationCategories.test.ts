import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  categoryBadgesFor,
  INTEGRATION_CATEGORY_TABS,
  integrationBelongsToCategory,
  isIntegrationCategoryId,
} from "./integrationCategories";
import {
  buildIntegrationsSettingsPath,
  identityTabSlugs,
  isDualPurposeIntegration,
  parseIntegrationCategory,
  parseIntegrationView,
} from "./integrationsSearchParams";

describe("integration categories", () => {
  it("hides ticketing, knowledge base, and support tabs", () => {
    const labels = INTEGRATION_CATEGORY_TABS.map((tab) => tab.label);
    assert.equal(labels.includes("Ticketing"), false);
    assert.equal(labels.includes("Knowledge Base"), false);
    assert.equal(labels.includes("Support"), false);
    assert.equal(parseIntegrationCategory("ticketing"), "hris");
    assert.equal(parseIntegrationCategory("knowledge"), "hris");
    assert.equal(parseIntegrationCategory("support"), "hris");
  });

  it("keeps nested All/Live under a category tab", () => {
    assert.equal(parseIntegrationCategory("identity"), "identity");
    assert.equal(parseIntegrationView("live"), "live");
    assert.equal(
      buildIntegrationsSettingsPath({ category: "identity", view: "live" }),
      "/dashboard/settings?settingsType=integrations&category=identity&integrationView=live",
    );
  });

  it("falls back to HRIS All when the query is missing", () => {
    assert.equal(parseIntegrationCategory(null), "hris");
    assert.equal(parseIntegrationView(null), "all");
    assert.equal(isIntegrationCategoryId("unknown"), false);
  });

  it("shows dual-purpose ClickUp and Zendesk on ticketing and knowledge", () => {
    const clickup = ["ticketing", "knowledge"];
    assert.equal(integrationBelongsToCategory(clickup, "ticketing"), true);
    assert.equal(integrationBelongsToCategory(clickup, "knowledge"), true);
    assert.equal(isDualPurposeIntegration(clickup), true);
    assert.deepEqual(categoryBadgesFor(clickup), [
      "Ticketing",
      "Knowledge base",
    ]);
  });

  it("still badges support integrations when categories include hidden tabs", () => {
    const zendesk = ["support", "ticketing", "knowledge"];
    assert.equal(integrationBelongsToCategory(zendesk, "support"), true);
    assert.equal(isIntegrationCategoryId("support"), true);
    assert.deepEqual(categoryBadgesFor(zendesk), [
      "Ticketing",
      "Knowledge base",
      "Support",
    ]);
    assert.equal(parseIntegrationCategory("support"), "hris");
  });

  it("keeps the workspace entity on the post-verify settings path", () => {
    assert.equal(
      buildIntegrationsSettingsPath({
        category: "hris",
        view: "all",
        extra: {
          integration: "bamboohr",
          integration_id: "int-1",
          code: "auth-code",
          entity: "entity-ca",
        },
      }),
      "/dashboard/settings?settingsType=integrations&category=hris&integrationView=all&integration=bamboohr&integration_id=int-1&code=auth-code&entity=entity-ca",
    );
  });

  it("lists identity tab contents", () => {
    assert.deepEqual(identityTabSlugs(), [
      "google-workspace",
      "microsoft-entra-id",
      "apple-business-manager",
      "microsoft-intune",
    ]);
    assert.equal(integrationBelongsToCategory(["identity"], "identity"), true);
    assert.equal(integrationBelongsToCategory(["hris"], "identity"), false);
  });
});
