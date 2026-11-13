import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Device Fleet",
  description: "Rayda Remote |  Dashboard | Device Fleet",
};

export default function All_EquipmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
