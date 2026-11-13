import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isNangoIntegration,
  knowledgeComingSoonCopy,
  isHiddenOnKnowledgeTab,
  nangoRoutingFieldsFor,
} from "./nangoRoutingFields";

describe("nangoRoutingFields", () => {
  it("returns optional routing fields for ticketing systems", () => {
    assert.equal(nangoRoutingFieldsFor("jira")[0]?.name, "project_key");
    assert.equal(nangoRoutingFieldsFor("clickup")[0]?.name, "board_id");
    assert.equal(nangoRoutingFieldsFor("linear")[0]?.name, "project_key");
    assert.equal(nangoRoutingFieldsFor("monday")[0]?.name, "board_id");
    assert.deepEqual(nangoRoutingFieldsFor("zendesk"), []);
    assert.equal(nangoRoutingFieldsFor("zoho-desk")[0]?.inputType, "select");
    assert.equal(nangoRoutingFieldsFor("zoho-desk")[1]?.inputType, "select");
    assert.deepEqual(nangoRoutingFieldsFor("freshservice"), []);
  });

  it("hides unwired knowledge sources from the Knowledge Base tab", () => {
    assert.equal(isHiddenOnKnowledgeTab("notion"), true);
    assert.equal(isHiddenOnKnowledgeTab("confluence"), true);
    assert.equal(isHiddenOnKnowledgeTab("google-drive"), true);
    assert.equal(isHiddenOnKnowledgeTab("jira"), false);
    assert.equal(isHiddenOnKnowledgeTab("clickup"), false);
  });

  it("uses stub copy for knowledge-only tools without collectors", () => {
    assert.match(knowledgeComingSoonCopy("notion") ?? "", /coming soon/);
    assert.equal(knowledgeComingSoonCopy("jira"), null);
    assert.equal(isNangoIntegration("nango"), true);
    assert.equal(isNangoIntegration("finch"), false);
  });
});
