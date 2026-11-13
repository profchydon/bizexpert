import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Storage | Country",
  description: "Rayda Remote |  Dashboard | Storage | Country",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
