export const bizExpertLoginHighlights = [
  {
    id: "stores",
    title: "Stores",
    description: "See stock across every location.",
  },
  {
    id: "stock",
    title: "Stock",
    description: "Know what you have on hand.",
  },
  {
    id: "sales",
    title: "Sales",
    description: "Record sales as they happen.",
  },
] as const;

export type BizExpertLoginHighlightId =
  (typeof bizExpertLoginHighlights)[number]["id"];
