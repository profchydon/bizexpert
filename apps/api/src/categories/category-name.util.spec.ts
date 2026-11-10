import {
  canDeleteCategory,
  categoryKey,
  findNameConflict,
  namesMatch,
  namesToBackfill,
  normalizeCategoryName,
} from "./category-name.util";

describe("category name helpers", () => {
  it("trims names and compares them case-insensitively", () => {
    expect(normalizeCategoryName("  Drinks  ")).toBe("Drinks");
    expect(categoryKey("Drinks")).toBe("drinks");
    expect(namesMatch("Drinks", "drinks")).toBe(true);
    expect(namesMatch("Drinks", "Food")).toBe(false);
  });

  it("finds a conflicting name except the row being renamed", () => {
    const rows = [
      { id: "a", name: "Drinks" },
      { id: "b", name: "Food" },
    ];
    expect(findNameConflict(rows, " drinks ")?.id).toBe("a");
    expect(findNameConflict(rows, "Drinks", "a")).toBeUndefined();
    expect(findNameConflict(rows, "Snacks")).toBeUndefined();
  });

  it("backfills only missing product category names", () => {
    expect(
      namesToBackfill(
        ["Drinks"],
        ["Drinks", "  food  ", "", null, "Food", "Snacks"],
      ),
    ).toEqual(["food", "Snacks"]);
  });

  it("blocks delete when products still use the name", () => {
    expect(canDeleteCategory(0)).toBe(true);
    expect(canDeleteCategory(2)).toBe(false);
  });
});
