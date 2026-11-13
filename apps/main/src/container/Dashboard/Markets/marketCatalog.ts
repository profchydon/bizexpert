export type MarketSlug = "jumia" | "konga" | "jiji";

export type MarketApp = {
  slug: MarketSlug;
  name: string;
  tagline: string;
  audience: string;
  website: string;
  category: string;
  logoClass: string;
};

export const MARKET_APPS: MarketApp[] = [
  {
    slug: "jumia",
    name: "Jumia",
    tagline: "List products and pull marketplace orders from Jumia.",
    audience: "Retail and wholesale sellers",
    website: "https://vendorhub.jumia.com",
    category: "Marketplace",
    logoClass: "bg-orange-50 text-orange-700",
  },
  {
    slug: "konga",
    name: "Konga",
    tagline: "Sync catalog and fulfill Konga marketplace orders.",
    audience: "Online retailers",
    website: "https://www.konga.com",
    category: "Marketplace",
    logoClass: "bg-red-50 text-red-700",
  },
  {
    slug: "jiji",
    name: "Jiji",
    tagline: "Publish listings and track Jiji classifieds orders.",
    audience: "Local sellers",
    website: "https://jiji.ng",
    category: "Classifieds",
    logoClass: "bg-green-50 text-green-700",
  },
];

export function findMarketApp(slug: string): MarketApp | undefined {
  return MARKET_APPS.find((app) => app.slug === slug);
}

export function marketInitial(name: string): string {
  return name.slice(0, 1).toUpperCase();
}
