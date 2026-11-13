import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Employee | Catalog Detail",
  description: "Rayda Remote | Employee |  Catalog Detail",
};

export default function EmployeeCatalogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
