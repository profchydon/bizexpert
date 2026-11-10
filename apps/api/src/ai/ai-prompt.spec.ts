import { readFileSync } from "fs";
import { join } from "path";

function source(name: string) {
  return readFileSync(join(__dirname, name), "utf8");
}

describe("AI response copy", () => {
  it("asks the model for markdown without emojis", () => {
    const text = source("ai.service.ts");
    expect(text).toContain("Do not use emojis.");
    expect(text).toContain("markdown");
    expect(text).not.toContain("with emojis");
  });

  it("keeps fallback copy free of emojis", () => {
    expect(source("ai-fallback.ts")).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(source("ai-execute.ts")).not.toContain("✅");
  });
});
