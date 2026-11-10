import { stripEmojis } from "./strip-emojis";

describe("stripEmojis", () => {
  it("removes emoji while keeping currency and markdown", () => {
    expect(stripEmojis("📊 **Today's Sales**\n\nRevenue: ₦12,000 ✅")).toBe(
      "**Today's Sales**\n\nRevenue: ₦12,000",
    );
  });

  it("collapses leftover spaces after emoji removal", () => {
    expect(stripEmojis("Hello 👋 there")).toBe("Hello there");
  });
});
