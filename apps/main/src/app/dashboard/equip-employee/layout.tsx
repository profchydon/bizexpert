import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Equip Employee",
  description: "Rayda Remote |  Dashboard | Equip Employee",
};

export default function EquipEmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
