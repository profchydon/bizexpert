import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Equip Employee | Employee",
  description: "Rayda Remote |  Dashboard | Equip Employee | Employee",
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
