import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | All Employees | View Employee",
  description: "Rayda Remote |  Dashboard | All Employees | View Employee",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
