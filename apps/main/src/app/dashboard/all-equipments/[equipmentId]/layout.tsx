import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Device Fleet | View Equipment",
  description: "Rayda | Dashboard | Device Fleet | View Equipment",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
