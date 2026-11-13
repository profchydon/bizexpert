import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Catalog | Marketplace",
  description: "Rayda Remote |  Dashboard | Catalog | Marketplace",
};

export default function CatalogMarketPlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
