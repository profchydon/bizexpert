import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AI_CHAT_PROMPTS,
  aiChatStorageKey,
  parseAiChatMessages,
} from "./aiChatStorage";

test("aiChatStorageKey is scoped by business", () => {
  assert.equal(aiChatStorageKey("biz-1"), "bizexpert.ai-chat.biz-1");
});

test("parseAiChatMessages drops invalid rows", () => {
  assert.deepEqual(parseAiChatMessages(null), []);
  assert.deepEqual(parseAiChatMessages("{"), []);
  assert.deepEqual(
    parseAiChatMessages(
      JSON.stringify([
        { id: "1", role: "user", content: "sales" },
        { id: "2", role: "system", content: "nope" },
        { role: "assistant", content: "missing id" },
      ]),
    ),
    [{ id: "1", role: "user", content: "sales" }],
  );
});

test("starter prompts cover sales stock and value", () => {
  assert.equal(AI_CHAT_PROMPTS.length, 3);
  assert.equal(
    AI_CHAT_PROMPTS.some((row) => row.includes("sell")),
    true,
  );
  assert.equal(
    AI_CHAT_PROMPTS.some((row) => row.includes("restock")),
    true,
  );
});
