import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Asset Vault | Order Summary",
  description: "Rayda Remote |  Dashboard | Asset Vault | Order Summary",
};

export default function All_EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
