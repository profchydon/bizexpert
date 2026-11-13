import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Employee | Catalogs",
  description: "Rayda Remote | Employee |  Catalogs",
};

export default function EmployeeCatalogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
