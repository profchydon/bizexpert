import { sanitizeChatHistory } from "./ai-history";

describe("sanitizeChatHistory", () => {
  it("keeps only user and assistant turns", () => {
    const cleaned = sanitizeChatHistory([
      { role: "user", content: "sales today" },
      { role: "assistant", content: "₦12,000" },
      { role: "user", content: "   " },
    ]);
    expect(cleaned).toEqual([
      { role: "user", content: "sales today" },
      { role: "assistant", content: "₦12,000" },
    ]);
  });

  it("caps length and content size", () => {
    const turns = Array.from({ length: 25 }, (_, i) => ({
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: "x".repeat(4010),
    }));
    const cleaned = sanitizeChatHistory(turns, 20);
    expect(cleaned).toHaveLength(20);
    expect(cleaned[0].content).toHaveLength(4000);
  });
});
