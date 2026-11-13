import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("dashboard frame mounts the AI chat widget", () => {
  const frame = readFileSync(
    "src/components/bizexpert/BizExpertDashboardFrame.tsx",
    "utf8",
  );
  assert.equal(frame.includes("AiChatWidget"), true);
});

test("chat widget posts to the AI chat endpoint", () => {
  const hook = readFileSync("src/components/bizexpert/useAiChat.ts", "utf8");
  assert.equal(hook.includes("/ai/chat"), true);
  assert.equal(hook.includes("history"), true);
});

test("panel exposes sale stock and confirm copy", () => {
  const panel = readFileSync(
    "src/components/bizexpert/AiChatPanel.tsx",
    "utf8",
  );
  assert.equal(panel.includes("Sales, stock, receipts, transfers"), true);
  assert.equal(panel.includes("Confirm with the action ID"), true);
  assert.equal(panel.includes("AiChatMarkdown"), true);
});
