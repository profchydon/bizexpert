import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Catalogs | View Catalog",
  description: "Rayda Remote |  Dashboard  Catalogs",
};

export default function ViewCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
