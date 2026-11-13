import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Catalogs | Employee Request",
  description: "Rayda Remote |  Dashboard  Catalogs",
};

export default function EmployeeRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
