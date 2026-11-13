import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | All Employees",
  description: "Rayda Remote |  Dashboard | All Employees",
};

export default function AllEmployees({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
