import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Equip Employee | Department",
  description: "Rayda Remote |  Dashboard  Equip Employee",
};

export default function DevicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
