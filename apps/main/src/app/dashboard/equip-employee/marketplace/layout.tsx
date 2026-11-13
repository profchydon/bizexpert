import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Equip Employee | Marketplace",
  description: "Rayda Remote |  Dashboard | Equip Employee | Marketplace",
};

export default function MarketPlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
