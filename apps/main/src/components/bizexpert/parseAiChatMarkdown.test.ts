import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseAiChatMarkdown,
  parseInlineMarkdown,
} from "./parseAiChatMarkdown";

test("parseInlineMarkdown supports bold italic and code", () => {
  assert.deepEqual(parseInlineMarkdown("**Total** is `₦12` and *sold*"), [
    { type: "strong", value: "Total" },
    { type: "text", value: " is " },
    { type: "code", value: "₦12" },
    { type: "text", value: " and " },
    { type: "strong", value: "sold" },
  ]);
});

test("parseAiChatMarkdown splits paragraphs lists and headings", () => {
  const blocks = parseAiChatMarkdown(
    "## Sales\n\nRevenue: ₦12,000\nProfit: ₦4,000\n\nAsk:\n- Rice\n- Oil",
  );
  assert.equal(blocks[0]?.type, "h");
  assert.equal(blocks[1]?.type, "p");
  assert.equal(blocks[2]?.type, "p");
  assert.equal(blocks[3]?.type, "ul");
  if (blocks[3]?.type === "ul") {
    assert.equal(blocks[3].items.length, 2);
  }
});
