import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Equip Employee | Orders",
  description: "Rayda Remote |  Dashboard | Equip Employee | Orders",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
